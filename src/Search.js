import React from 'react';


const Search = (props) => (
    <header className="search-header">
        <div className="button-container">
            <button onClick={props.showList}>Lista</button>
        </div>
        <div className="searchbar-container">
            <input aria-label="Insira texto para busca" placeholder="Procure local" type="search" onChange={(e) => props.filterList(e)} value={props.value}></input>
        </div>
    </header>
)

export default Search