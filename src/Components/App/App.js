import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playListName: 'My PlayList',
      playListTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
  }
  
  addTrack(track) {
    let addedTracks = this.state.playlistTracks;
    let isAdded = addedTracks.some(playlistTrack => track.id === playlistTrack.id);

    if (!isAdded) {
      addedTracks.push(track);
      this.setState({ playlistTracks: addedTracks});
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({playListTracks: tracks});
  }

  savePlayList() {
    let trackURIs = this.state.playListTracks.map(track => track.uri);

    Spotify.savePlayList(this.state.playListName, trackURIs).then(() => {
          this.setState(
            {
              playListName: 'New Playlist',
              playListTracks: []
            });
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  updatePlaylistName(name) {
    this.setState({playListName: name});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />

          <div className="App-playlist">

            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />

            <Playlist
              playlist={this.state.playListName}
              tracks={this.state.playListTracks}
              onNameChange={this.updatePlaylistName}
              onRemove={this.removeTrack}
              onSave={this.savePlayList}
            />

          </div>
        </div>
      </div>
    );
  }
}

export default App;
