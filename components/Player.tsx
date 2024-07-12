import useSpotify from '../hooks/useSpotify';
import React, { useEffect, useState } from 'react';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import Slider from '@mui/material/Slider';
import MediaControl from './MediaControl';

function Player({trackClicked}:{trackClicked:any}) {
	const spotifyApi = useSpotify();
	const [track, setTrack] = useState<any>();
	const [songChanged, setSongChanged] = useState(false);
    const [songFinished, setsongFinished] = useState(false);

	// Add a setTimeout because when we play a song then fetch the currently playing there may be a race condition so fetching the current song may not be accurate
	useEffect(() => {
		setTimeout(() => {
			fetch("https://api.spotify.com/v1/me/player/currently-playing", {
				method: 'GET',
				headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
			})
			.then(result => result.json())
			.then(data => {
				setTrack(data.item);
			});
		}, 500)
	}, [trackClicked, songChanged, songFinished])

	const updateTrack = (nextTrack:any) => {
		setTrack(nextTrack);
		setSongChanged(!songChanged);
	};

	const updateSongFinished = () => {
		setsongFinished(!songFinished);
	};
	
	// Refactor into 3 components
	return (
			<div className='h-24 bg-[#111111] text-white absolute inset-x-0 bottom-0 flex items-center justify-between pl-2 pr-8' >
				<div className='flex items-center w-96' >
					{
						track &&
						track.album &&
							<>
								<img src={track.album.images[0].url} alt='album image' width={50} height={50} className='rounded-sm' />
								<div className='pl-3' >
									<h1 className='text-sm truncate' >{track.name}</h1>
									<p className='text-sm text-neutral-400 truncate' >{track.artists[0].name}</p>
								</div>
							</>
					}
				</div>

				<MediaControl updateTrack={updateTrack} trackClicked={trackClicked} songFinished={songFinished} updateSongFinished={updateSongFinished} />
			</div>
	)
}

export default Player