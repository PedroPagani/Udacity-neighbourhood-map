import React, { Component } from 'react';


class Search extends Component {

   

    render() {
        return (
            <header className="search-header">
                <div className="button-container">
                    <button onClick={this.props.showList}>Lista</button>
                </div>
                <div className="searchbar-container">
                    <input placeholder="Search name" type="search" onChange={(e) => this.props.filterList(e)} value={this.props.value}></input>
                </div>
            </header>
        )
    }
}

export default Search