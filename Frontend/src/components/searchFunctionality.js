export function keywordSearch(query, index) {
    const queryWords = query.toLowerCase().split(' ');
    const resultDocs = {}; // Using an object to store doc_id and its total frequency
    
    queryWords.forEach((word) => {
        if (index[word]) {
            index[word].forEach((entry) => {
                const { doc_id, frequency } = entry;
                if (!resultDocs[doc_id]) {
                    resultDocs[doc_id] = 0;
                }
                resultDocs[doc_id] += frequency;
            });
        }
    });
    // console.log(resultDocs)
    const sortedResults = Object.keys(resultDocs)
        .sort((a, b) => resultDocs[b] - resultDocs[a])
        .map(doc_id => parseInt(doc_id));
    
    // console.log(sortedResults)
    return sortedResults;
}
