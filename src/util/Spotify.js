const clientID = 'eb1faacdfe8c4b9781866ca81cc666d9';
const redirectURI = 'http://localhost:3000/';
//const redirectURI = 'http://quercus.surge.sh/';


let accessToken;

let Spotify = {
	getAccessToken() {

		if(accessToken) {
			return accessToken;
		}

		let accessTokenValue = window.location.href.match(/access_token=([^&]*)/);
	    let expirationTime = window.location.href.match(/expires_in=([^&]*)/);

	    if (accessTokenValue && expirationTime) {
		     accessToken = accessTokenValue[1];
		     const expiresIn = Number(expirationTime[1]);
		     window.setTimeout(() => accessToken = '', expiresIn * 1000);
		     window.history.pushState('Access Token', null, '/');

		     return accessToken;
	    } else {
		     window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
		  }
	},

	search(term) {
	    const accessToken = Spotify.getAccessToken();

	    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
	      headers: {
	        Authorization: `Bearer ${accessToken}`
	      }
	    }
	  ).then(response => { return response.json(); }
	  ).then(jsonResponse => {
	      if (!jsonResponse.tracks) {
	        return [];
		}

		 return jsonResponse.tracks.items.map(track => ({
	        id: track.id,
	        name: track.name,
	        length: track.duration_ms,
	        image: track.album.images[2],
	        artist: track.artists[0].name,
	        album: track.album.name,
	        uri: track.uri
	      }));
	    });
	},

	savePlayList(name, trackUris) {
	    if (!name || !trackUris.length) {
	      return;
	    }

	    let accessToken = Spotify.getAccessToken();
	    let headers = {
	      Authorization: `Bearer ${accessToken}`
	    };
	    let userId;
	    return fetch('https://api.spotify.com/v1/me', {headers: headers})
	      .then(response => response.json())
	      .then(jsonResponse => {
	        userId = jsonResponse.id;
	        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
	          {
	            headers: headers,
	            method: 'POST',
	            body: JSON.stringify({ name: name })
	          }
	        )
	        .then(response => response.json())
	        .then(jsonResponse => {
	          let playListId = jsonResponse.id;
	          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`,
	             {
	               headers: headers,
	               method: 'POST',
	               body: JSON.stringify( { uris: trackUris } )
	             }
	           );
	         }
	        );
	      }
	    );
	}

};


export default Spotify;
