import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import Image from "next/image";
import Track from './Track';


function ArtistPage({artistID, updateTrackClicked, updateAlbumClicked}:{artistID:any, updateTrackClicked:any, updateAlbumClicked:any}) {
    const spotifyApi = useSpotify();
    const [artist, setArtist] = useState<any>(null);
    const [topTracks, setTopTracks] = useState([]);
    const [albums, setAlbums] = useState([]);

    const fetchArtist = () => {
        fetch(`https://api.spotify.com/v1/artists/${artistID}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(result => result.json())
        .then(data => setArtist(data));
    };

    const fetchTopTracks = () => {
        fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(result => result.json())
        .then(data => setTopTracks(data.tracks));
    };

    const fetchAlbums = () => {
        fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album%2Csingle&limit=50`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(result => result.json())
        .then(data => setAlbums(data.items));
    };

    useEffect(() => {
        fetchArtist();
        fetchTopTracks();
        fetchAlbums();
    }, [spotifyApi, artistID]);
    
    return (
        <div className="text-white pb-36 h-screen overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-neutral-700" >
            {
                artist &&
                <div className="flex items-end mb-5 ml-4" >
                    <Image src={artist.images[0].url} alt="artist profile" width={200} height={200} className="rounded-full mt-5 pl-2 pr-2" />
                    <h1 className="text-7xl font-bold pl-2" >{artist.name}</h1>
                </div>
            }
            <div className="pl-4" >
                {
                    topTracks && 
                    topTracks.map((track:any, index) => (
                        <Track track={track} offset={track.track_number} index={index+1} key={index+1} updateTrackClicked={updateTrackClicked} playlistUri={track.album.uri} />
                    ))
                }
            </div>
            <div className="flex flex-wrap pl-4" >
                {
                    albums &&
                    albums.map((album:any, index:number) => (
                        <div className="p-5 w-52 hover:bg-[#c7c7c7] hover:bg-opacity-5 cursor-pointer rounded-md" key={index}
                            onClick={() => updateAlbumClicked(album.id)}
                        >
                            <Image src={album.images[0].url} alt="album cover" width={150} height={150} className="rounded" />
                            <h1 className="truncate text-nowrap pt-2" >{album.name}</h1>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ArtistPage;