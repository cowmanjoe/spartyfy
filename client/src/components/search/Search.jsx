import React, { Component } from 'react';
import SearchSong from './SearchSong.jsx';
import { MDBCol } from "mdbreact";
import './Search.scss';
import { SearchInput, Page, List, ListHeader, ListItem, Button } from 'react-onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import queryString from 'query-string';

const searchUrl = 'http://localhost:5000/search/song';

class Search extends Component {
    constructor() {
        super();
        this.state = { 
            isSearch: true,
            songs: []
        };

        this.searchSong = this.searchSong.bind(this);
    }
    render() { 
        return (
            <div>
                <span>
                    <SearchInput
                    style={{width: "100%"}}
                    value={this.state.text}
                    onChange={(event) => { this.setState({text: event.target.value, isSearch: false})} }
                    modifier='material'
                    placeholder='Search' />
                    <Button
                    onClick={this.searchSong}>Search</Button>
                </span>
                <List
                    dataSource={this.state.songs}
                    renderRow={(row, idx) => <SearchSong id={idx} songTitle={row.songTitle} songArtist={row.songArtist} songImage={row.songImage}/>}
                />
            </div>
        );
    }
    /* TODO: add an on-init fetch for Spotify top songs */

    async searchSong() {
        let query = this.state.text;

        if (!query) {
            return;
        }

        let results = await fetch(searchUrl + '?' +
            queryString.stringify({q: query}));

        results = await results.json();

        console.log(results);

        this.setState({rawSongs: results});
        this.setState({songs: []});
        this.setState({songs: this.convertToSongs(results)})
    }

    convertToSongs(results) {
        let items = results.tracks.items;

        console.log('items:\n');
        console.log(JSON.stringify(items));
        let songs = items.map(function (item) {
            console.log(JSON.stringify(item));
            debugger;
            let song = {};

            song.songTitle = item.name;

            song.songArtist = '';
            item.artists.forEach(function(artist) {
                song.songArtist += artist.name;
                song.songArtist += ', ';
            });

            // assuming the last image is smallest
            let lastId = item.album.images.length - 1;
            song.songImage = item.album.images[lastId].url;

            return song;
        });

        return songs;
    }
}

 
export default Search;