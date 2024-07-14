import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import PauseCircleFilledOutlinedIcon from '@mui/icons-material/PauseCircleFilledOutlined';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import { getDuration } from '../lib/utils';
import { useCallback, useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import useSpotify from '../hooks/useSpotify';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';

function MediaControl({updateTrack, trackClicked, songFinished, updateSongFinished}:{updateTrack:any, trackClicked:any, songFinished:any, updateSongFinished:any}) {

    const spotifyApi = useSpotify();
    const debounce = require("lodash.debounce");
    const [shuffle, setShuffle] = useState(false);
	const [play, setPlay] = useState(false);
    const [skip, setSkip] = useState(false);
	const [position, setPosition] = useState<number | null>(null);
    const [userChangePosition, setUserChangePosition] = useState(false);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(40);

    // Fetches current player state
    const fetchPlayerState = (retryCount = 0) => {
        fetch("https://api.spotify.com/v1/me/player", {
            method: 'GET',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(result => {
            if (!result.ok) {
                throw new Error("JSON PARSE ERROR IN MEDIACONTROLS");
            }
            return result.json();
        })
        .then(data => {
            if (data && data.item.duration_ms) {
                setShuffle(data.shuffle_state);
                setPlay(data.is_playing);
                setDuration(data.item.duration_ms);
                setPosition(data.progress_ms);
                setVolume(data.device.volume_percent);
            }
        })
        .catch(error => {
            console.log(error);
            if (retryCount < 5) {
                setTimeout(() => fetchPlayerState(retryCount+1), 2000)
            }
        });
    };

    // Add a setTimeout because when we play a song then fetch the currently playing there may be a race condition so fetching the current song may not be accurate
    useEffect(() => {
        setTimeout(() => {
            fetchPlayerState();
        }, 500);
    }, [trackClicked, skip, songFinished]);

    // Handles updating the position of the song each second
    useEffect(() => {
        if (play) {
            const intervalId = setInterval(() => {
                if (position && position + 1000 >= duration) {
                    setPosition(0);
                    updateSongFinished();
                    clearInterval(intervalId);
                } else {
                    setPosition(prevPosition => prevPosition ? prevPosition + 1000 : 0);
                }
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [play, duration, position, songFinished]);

    useEffect(() => {
        debouncedAdjustTrackPosition(position);
    }, [userChangePosition]);

    // Create a debounce to wait 500ms before sending a position change request to avoid making to many requests at once
    const debouncedAdjustTrackPosition = useCallback(
        debounce((position: number) => {
            setPosition(position);
            fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
            });
        }, 500),
    []);

    // Handles play pause click
    const handlePlayClick = () => {
        fetch(`https://api.spotify.com/v1/me/player/${play ? "pause" : "play"}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(() => setPlay(!play));
    };

    // Handles skip to previous track
    const handleSkipPreviousClick = () => {
        fetch("https://api.spotify.com/v1/me/player/previous", {
            method: 'POST',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(() => {
            updateTrack();
            setSkip(!skip);
        });
    };

    // Handles skip to next track
    const handleSkipNextClick = () => {
        fetch("https://api.spotify.com/v1/me/player/next", {
            method: 'POST',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(() => {
            updateTrack();
            setSkip(!skip);
        });
    };

    // Handles shuffle on or off
    const handleShuffleClick = () => {
        fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
        })
        .then(() => setShuffle(!shuffle));
    };

    useEffect(() => {
        debouncedAdjustVolume(volume);
    }, [volume]);

    // Create a debounce to wait 500ms before sending a volume change request to avoid making to many requests at once
    const debouncedAdjustVolume = useCallback(
        debounce((volume: number) => {
            fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
            });
        }, 500),
    []);

    return (
        <>
            <div>
                <div className='flex items-center justify-center h-14' >
                    {
                        shuffle ?
                        <ShuffleOnIcon className='cursor-pointer text-neutral-400 hover:text-white' fontSize='small' onClick={handleShuffleClick} />
                        : <ShuffleIcon className='cursor-pointer text-neutral-400 hover:text-white' fontSize='small' onClick={handleShuffleClick} />
                        
                    }

                    <SkipPreviousIcon className='cursor-pointer ml-3 mr-3 text-neutral-400 hover:text-white' fontSize='large' onClick={handleSkipPreviousClick} />

                    {
                        play ?
                        <PauseCircleFilledOutlinedIcon className='cursor-pointer hover:text-5xl w-11' sx={{fontSize: 40}} onClick={handlePlayClick} /> 
                        : <PlayCircleFilledOutlinedIcon className='cursor-pointer hover:text-5xl w-11' sx={{fontSize: 40}} onClick={handlePlayClick} />
                    }

                    <SkipNextIcon className='cursor-pointer ml-3 mr-3 text-neutral-400 hover:text-white' fontSize='large' onClick={handleSkipNextClick} />
                </div>

                <div className='flex items-center'>
                    <p className='text-sm text-neutral-400 w-14' >{getDuration(position ? position : 0)}</p>
                    <Slider aria-label="Volume" size='small' 
                            className='text-white w-96'
                            min={0} max={duration} step={1}
                            onChange={(e) => {
                                const inputTarget = e.target as HTMLInputElement;
                                setUserChangePosition(!userChangePosition);
                                setPosition(Number(inputTarget.value));
                            }} 
                            value={typeof position === 'number' ? position : 0}
                    />
                    <p className='pl-2 text-sm text-neutral-400 w-14' >{getDuration(duration)}</p>
                </div>
            </div>

            <div className='flex w-36 items-center' >
                <VolumeDownIcon className='cursor-pointer mr-2' />
                <Slider aria-label="Volume" size='small' 
                        className='text-white' 
                        min={0} max={100} step={1} 
                        value={typeof volume === 'number' ? volume : 0} 
                        onChange={(e) => {
                            const inputTarget = e.target as HTMLInputElement;
                            setVolume(Number(inputTarget.value))
                            
                        }}
                />
            </div>
        </>
    );
}

export default MediaControl;