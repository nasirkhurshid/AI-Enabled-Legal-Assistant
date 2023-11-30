import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NoChats from './noChats';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faHeadset } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';

const ChatBox = ({ msgs, head }) => {
    const [heading, setHeading] = useState(head)
    const currentDate = new Date();
    // const date = formatDate(currentDate);
    const date = head;
    const [messages, setMessages] = useState(msgs);
    const [input, setInput] = useState('');
    const [botResponse, setBotResponse] = useState(null)
    const [typing, setTyping] = useState(false)
    const user = localStorage.getItem('user')
    const ref = useRef()

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSendMessage = (event) => {
        event.preventDefault()
        if (input.trim() === '') return;

        const newMessage = {
            text: input,
            isUser: true,
        };
        setTyping(true)
        setMessages([...messages, newMessage]);
        setInput('');
    };

    const chat = async (query) => {
        // console.log(query.text)
        let response
        let url = 'http://127.0.0.1:5000/ask?query=' + query.text
        console.log(url)
        try {
            const res = await axios.get(url)
            response = res.data
            console.log('resp', response)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        return response
    }

    const saveMessages = async (q, res) => {
        // console.log(user)
        let url = 'http://127.0.0.1:5000/save?user=' + user + '&q=' + q + '&res=' + res + '&date=' + date
        try {
            const res = await axios.get(url)
            let resp = res.data
            console.log(resp)
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }


    useEffect(() => {
        let currentMsg = messages[messages.length - 1];

        if (messages.length > 0 && currentMsg.isUser) {
            // Simulate bot response after a short delay
            console.log('current', currentMsg);
            chat(currentMsg).then((response) => {
                let bot = { text: response, isUser: false };
                console.log(bot);
                console.log('old message:', messages[messages.length - 2]);
                if (bot !== messages[messages.length - 2]) {
                    setBotResponse(bot);
                    console.log('--- ENTERED ---');
                }
            });
        }
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }

    }, [messages]);

    useEffect(() => {
        if (botResponse !== null) {
            setTyping(false)
            setMessages([...messages, botResponse]);
            saveMessages(messages[messages.length - 1].text, botResponse.text);
        }
    }, [botResponse]);

    return (
        <div className="chatbot-container w-100 bg1" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {heading && <div className='sidebar-header d-md-none'>Chat of {heading}</div>}
            {!heading && <NoChats></NoChats>}
            {typing && heading && <Loading></Loading>}

            <div className="chatbot-messages d-flex flex-column p-3">
                {messages.map((message, index) => (
                    <div key={index}>
                        {
                            message.isUser ? (<div className='d-flex flex-row-reverse'>
                                <div><FontAwesomeIcon icon={faCircleUser} className='fs-4 clr3 ms-2' /></div>
                                <div className={`message ${message.isUser ? 'user' : 'bot'} mb-3 p-1 pe-3 ps-3`}>
                                    {message.text}
                                </div>
                            </div>
                            ) : (<div className='d-flex justify-content-start'>
                                <div><FontAwesomeIcon icon={faHeadset} className='fs-4 clr2 me-2' /></div>
                                <div className={`message ${message.isUser ? 'user' : 'bot'} mb-3 p-1 pe-3 ps-3`}>
                                    {message.text}
                                </div>
                            </div>
                            )
                        }
                    </div>))}
            </div>

            <div style={{ position: 'relative', display: "flex", justifyContent: "center", alignItems: "center" }}>
                <form onSubmit={handleSendMessage} className='d-flex justify-content-center msgForm' style={{ position: "fixed", bottom: "0px", paddingBottom: "10px", width: '90%' }}>
                    <input
                        className='w-7 msg-input'
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder={typing ? 'CyberBot is typing...' : 'Type your message...'}
                    />
                    <button onClick={handleSendMessage} disabled={heading === null || typing} type='submit' className={`fs-4 p-1 ps-2 pe-3 send`}><FontAwesomeIcon icon={faPaperPlane} className='clr3' /></button>
                </form>
            </div>
            <div ref={ref} className='mt-3 invisible'>Lorem ipsum</div>
        </div>
    );
};

export default ChatBox;
