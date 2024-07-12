import SpotifyWebApi from "spotify-web-api-node";

// Permissions needed from User
const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-follow-read',
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read',
    'user-read-email',
    'user-read-private'
].join(',');

const params = {
    scope: scopes
};

const queryParamStr = new URLSearchParams(params);

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET
});

const LOGIN_URL = `http://accounts.spotify.com/authorize?${queryParamStr.toString()}`;

export default spotifyApi;

export { LOGIN_URL };