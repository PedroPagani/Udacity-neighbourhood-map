import React from 'react';


const Search = (props) => (
    <header className="search-header">
        <div className="button-container">
            <button onClick={props.showList}>Lista</button>
        </div>
        <div className="searchbar-container">
            <input placeholder="Search name" type="search" onChange={(e) => props.filterList(e)} value={props.value}></input>
        </div>
    </header>
)

export default Search