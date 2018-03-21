import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = this.state = {searchTerm: ''};

		this.handleTermChange = this.handleTermChange.bind(this);
		this.search = this.search.bind(this);
	}

	handleTermChange(event) {
		this.setState({searchTerm: event.target.value});
	}

	search() {
		this.props.onSearch(this.state.searchTerm);
	}

	render() {
		return(
		<div className="SearchBar">
		  <input placeholder="Enter A Song, Album, or Artist"
		  		 onChange={this.handleTermChange}
		  />
		  <a>SEARCH</a>
		</div>)
	}
}

export default SearchBar;
