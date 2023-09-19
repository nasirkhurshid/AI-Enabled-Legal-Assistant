from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from datetime import datetime
import os, re, string
import openai
from langchain.memory import ConversationBufferMemory
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationChain, ConversationalRetrievalChain

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())
openai.api_key = os.environ["OPENAI_API_KEY"]

llm_name = "gpt-3.5-turbo-0301"
persist_directory = './faiss/'
keywords = ["address", "contact", "office", "complaint", "email"]
fiaRelated = 0
chat_history = []


embedding = OpenAIEmbeddings()


# Append chat history
def get_chat_history(inputs) -> str:
    res = []
    for human, ai in inputs:
        res.append(f"Human:{human}\nAI:{ai}")
    return "\n".join(res)


def load_files(files):
    loader = []
    for file in files:
        loader.append(TextLoader(file, encoding="utf-8"))
    return loader


def create_embeddings(loaders):
    docs = []
    for loader in loaders:
        docs.extend(loader.load())

    text_splitter = CharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
    documents = text_splitter.split_documents(docs)

    vectorstore = FAISS.from_documents(
        documents=documents,
        embedding=embedding,
        persist_directory=persist_directory
    )
    vectorstore.save_local(persist_directory)
    return vectorstore


def isWordPresent(sentence, word):
    sentences = sentence.split(" ")
    cleaned_sentences = [''.join(char for char in word if char not in string.punctuation) for word in sentences]
    for i in cleaned_sentences:
        if (i == word):
            return True
    return False


def isFiaRelated(sentence):
    global fiaRelated
    for word in keywords:
        if isWordPresent(sentence, "fia"):
            fiaRelated = 1
            return True
        elif isWordPresent(sentence, word) and fiaRelated == 1:
            return True
    return False


# Load files
files_list = ["FIA.txt", "PECA.txt"]
# loaders = load_files(files_list)        # load files
# vectorstore = create_embeddings(loaders)    # create embeddings

# Retrieve embeddings
vectorstore = FAISS.load_local(persist_directory, embedding)

llm = ChatOpenAI(model_name=llm_name, temperature=0)
memory = ConversationBufferMemory(
    memory_key="chat_history", return_messages=True)
retriever = vectorstore.as_retriever(search_type="similarity")  # arguments


template = """
    You are CyberBot, a helpful legal assistant with expertise in the Cyber Crime and Prevention against Electronic Crimes Act (PECA) of Pakistan. \
    Your role is to provide accurate and concise answers to queries related specifically to the PECA and Cyber crimes.

    1. Always respond to greetings courteously.
    2. If you receive a query related to the PECA, answer it using the same words as mentioned in the PECA document.
    3. Provide answers in simple and straightforward language, avoiding any unnecessary complexity.
    4. If you encounter a question unrelated to the PECA or don't know the answer, reply with "Sorry, I don't know. Please try rephrasing your query."
    5. Avoid creativity in your responses and stick to the precise information available in the PECA.

    Remember, the goal is to provide to-the-point and factual answers while adhering strictly to the context and rules mentioned above.

    If you receive a query that you don't understand or is ambiguous, you can respond with "Apologies, I couldn't understand the query. Please try rephrasing or ask another question related to the PECA or FIA."

    Now, you can proceed to answer the questions using the information provided in the PECA and FIA document.
    Current conversation:
    {history}
    Client: {input}
    AI:"""

PROMPT = PromptTemplate(
    input_variables=["history", "input"], template=template)

# CHAIN 1
conversation = ConversationChain(
    prompt=PROMPT,
    llm=llm,
    # verbose=True,
    memory=ConversationBufferMemory(human_prefix="Client"),
)

# CHAIN 2
fiaQA = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    # verbose=True,
    memory=memory,
    get_chat_history=get_chat_history,
)

##########################


def custom_sort(date_str):
    day, month, year = map(int, date_str.split('/'))
    return year, month, day

##########################
###     FLASK APP      ###
##########################


app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/legalAssistant'
mongo = PyMongo(app)


@app.route('/')
@cross_origin()
def index():
    return 'PECA API'

@app.route('/ask')
@cross_origin()
def ask():
    query = request.args.get('query')
    if query:
        if isFiaRelated(sentence=query.lower()):
            res = fiaQA({"question": query, "chat_history": chat_history})
            result = res["answer"]
            print('\n\nFIA Chain\n\n')
        else:
            global fiaRelated
            fiaRelated = 0
            result = conversation.predict(input=query)
            print('\n\nCoversationChain\n\n')
        return result
    else:
        return 'No query given!'


@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(username, password)

    users_collection = mongo.db.login
    user = users_collection.find_one(
        {'username': username, 'password': password})
    print(user)
    if user:
        return jsonify({'message': 'Login successful!'}), 200
    else:
        return jsonify({'message': 'Invalid credentials!'}), 401


def is_alphanumeric(input_string):
    pattern = r'^[a-zA-Z0-9]+$'
    if re.match(pattern, input_string):
        return True
    else:
        return False


@app.route('/signup', methods=['POST'])
@cross_origin(supports_credentials=True)
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(username, password)
    if len(username) < 4 or len(password) < 8 or not is_alphanumeric(username):
        return jsonify({'message': 'Invalid credentials length!'}), 402

    users_collection = mongo.db.login
    user = users_collection.find_one({'username': username})

    if user:
        return jsonify({'message': 'Account already exists!'}), 401
    else:
        user = users_collection.insert_one(
            {'username': username, 'password': password})
        if user.acknowledged:
            return jsonify({'message': 'Sign Up successful!'}), 200
        else:
            return jsonify({'message': 'Registration failed!'}), 401


@app.route('/messages', methods=['POST'])
@cross_origin(supports_credentials=True)
def messages():
    data = request.json
    username = data.get('username')
    date = data.get('date')
    print(username, date)

    msgCollection = mongo.db.messages
    msgs = list(msgCollection.find({'username': username, 'date': date}, {
                '_id': 0, 'message': 1, 'response': 1}))
    if msgs:
        return jsonify(msgs), 200
    else:
        return jsonify([]), 200


@app.route('/conversations', methods=['POST'])
@cross_origin(supports_credentials=True)
def conversations():
    data = request.json
    username = data.get('username')
    print('Loading conversations for:',username)

    msgCollection = mongo.db.messages
    msgs = list(msgCollection.find({'username': username}, {'_id': 0, 'date': 1}))
    dates = [msg['date'] for msg in msgs]
    date_pattern = r'\d{2}/\d{2}/\d{4}'
    dates = [s for s in dates if re.search(date_pattern, s)]
    # print(dates)
    dates.sort(key=lambda date: datetime.strptime(date, "%d/%m/%Y"))
    dates = list(set(dates))
    dates.sort(key=lambda date: datetime.strptime(date, "%d/%m/%Y"), reverse=True)
    if dates:
        return jsonify(dates), 200
    else:
        return jsonify({'message': 'Invalid credentials!'}), 401


@app.route('/save')
@cross_origin(supports_credentials=True)
def save():
    user = request.args.get('user')
    query = request.args.get('q')
    response = request.args.get('res')
    date = request.args.get('date')
    print(user, query, response, date)
    print('Saving message of:',user)
    messages = mongo.db.messages
    msg = messages.insert_one(
        {'username': user, 'message': query, 'response': response, 'date': date})
    if msg.acknowledged:
        return jsonify({'message': 'Message saved successfully!'}), 200
    else:
        return jsonify({'message': 'Error occurred!'}), 401


if __name__ == '__main__':
    app.run(debug=True)
