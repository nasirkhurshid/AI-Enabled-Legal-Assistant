import { React, useState, useEffect } from 'react';
import Clauses from './clauses';
import { lawsToDisplay, headings } from './data'
import 'bootstrap/dist/css/bootstrap.min.css';

const HomeScreen = ({ results }) => {
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setSearchResults(results);
    }, [results])

    return (
        <div>
            <div>
                {searchResults.map((resultIndex) => (
                    <Clauses
                        key={resultIndex}
                        // heading={(resultIndex + 1) + '. ' + headings[resultIndex]}
                        heading={headings[resultIndex]}
                        law={lawsToDisplay[resultIndex]}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomeScreen;
