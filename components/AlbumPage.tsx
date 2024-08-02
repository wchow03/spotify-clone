
import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import Image from "next/image";
import Track from './Track';

function AlbumPage({albumID, updateTrackClicked}:{albumID:any, updateTrackClicked:any}) {
    const spotifyApi = useSpotify();
    const [album, setAlbum] = useState<any>([]);
    
    useEffect(() => {
        fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(result => result.json())
        .then(data => setAlbum(data));
    }, [spotifyApi, albumID]);

    return (
        <div className="text-white pb-36 h-screen overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-neutral-700" >
            {
                album.images &&
                album &&
                <>
                    <div className="md:flex items-end p-10" >
                        <Image src={album.images[0].url} alt="artist profile" width={250} height={250} className="rounded-lg" />
                        <h1 className="text-7xl font-bold pl-6" >{album.name}</h1>
                    </div>
                    <div className="pl-4" >
                        {
                            album.tracks.items.map((track:any, index:number) => (
                                <Track track={track} offset={track.track_number} index={index+1} key={index+1} updateTrackClicked={updateTrackClicked} playlistUri={album.uri} />
                            ))
                        }
                    </div>
                </>
            }
        </div>
    );
}

export default AlbumPage;