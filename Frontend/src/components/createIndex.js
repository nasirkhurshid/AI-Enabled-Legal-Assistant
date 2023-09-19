import { laws } from "./data";

export function createIndex(data) {
    const index = {};
    const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g;
    
    data.forEach((document, doc_id) => {
        const words = document.toLowerCase().replace(punctuationRegex, '').split(' ');
        
        words.forEach((word) => {
            if (!index[word]) {
                index[word] = [];
            }
            
            if (!index[word].some(entry => entry.doc_id === doc_id)) {
                index[word].push({ doc_id, frequency: 1 });
            } else {
                const existingEntry = index[word].find(entry => entry.doc_id === doc_id);
                existingEntry.frequency += 1;
            }
        });
    });
    
    return index;
}

export const index = createIndex(laws);
