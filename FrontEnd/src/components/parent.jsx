import React, { useState } from 'react';
import { index } from './createIndex';
import { keywordSearch } from './searchFunctionality';
import { Navigate, useNavigate } from 'react-router-dom';
import HomeScreen from './homeScreen';
import Header from './header';
import NoData from './noData';

function Parent() {
    const navigate = useNavigate()
    const [searchResults, setSearchResults] = useState([]);
    const [isResultsVisible, setIsResultsVisible] = useState(false)
    const [read, setRead] = useState(false)

    const user = localStorage.getItem('user')

    const performSearch = (searchTerm) => {
        const results = keywordSearch(searchTerm, index)
        setSearchResults(results);
        setIsResultsVisible(results.length > 0);
        setRead(false)
    };

    const handleRead = () => {
        setIsResultsVisible(false)
        setRead(!read)
        if (!read) {
            setSearchResults([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
        } else {
            setSearchResults([])
        }
    }

    const handleChat = () => {
        navigate('/chat')
    }

    const handleSession = () => {
        localStorage.clear()
        navigate('/')
    }

    if (user) {
        let msg = 'Search by keywords or click \'Read Laws\' to read all the laws'
        return (
            <div className='body'>
                <Header visible={isResultsVisible} onSearch={performSearch} onRead={handleRead} onChat={handleChat} onLogout={handleSession} />
                {isResultsVisible ? <HomeScreen key={1} results={searchResults} /> :
                    read && !isResultsVisible ? <HomeScreen key={2} results={searchResults} /> : <NoData text={msg}></NoData>}
            </div>
        );
    }
    else {
        return <Navigate to='/'></Navigate>
    }
}

export default Parent;
