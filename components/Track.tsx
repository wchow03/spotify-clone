import useSpotify from '../hooks/useSpotify';
import { getDuration } from '../lib/utils';

function Track({track, index, updateTrackClicked, playlistUri}:{track:any, index:any, updateTrackClicked:any, playlistUri:any}) {
    const spotifyApi = useSpotify();
    
    const handleDoubleClick = () => {
        
        if (spotifyApi.getAccessToken()) {
            fetch("https://api.spotify.com/v1/me/player/play", {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${spotifyApi.getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "context_uri": `${playlistUri}`,
                    "offset": { "position": `${index}` },
                    "position_ms": 0
                })
            })
            .then(() => updateTrackClicked());
        }
    }

    return (
        <div className='grid md:grid-cols-2 hover:bg-[#c7c7c7] hover:bg-opacity-5 cursor-pointer p-1 rounded-md' onDoubleClick={handleDoubleClick} >
            <div className='flex space-x-4 items-center overflow-hidden' >
                <p className='text-neutral-400 w-7' >{index+1}</p>
                <img src={track.track.album.images[0].url} alt='playlist picture' width={40} height={40} className='rounded-md' />
                <div className='min-w-0' >
                    <p className='truncate'>{track.track.name}</p>
                    <p className='text-sm text-neutral-400' >{track.track.artists[0].name}</p>
                </div>
            </div>
            <div className='text-neutral-400 flex justify-between' >
                <p className='truncate mr-2 hidden md:inline' >{track.track.album.name}</p>
                <p className='mr-2 hidden md:inline' >{getDuration(track.track.duration_ms)}</p>
            </div>
        </div>
    );
}

export default Track;