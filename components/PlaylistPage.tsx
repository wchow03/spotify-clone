import useSpotify from '../hooks/useSpotify';
import { getRandomNumber } from '../lib/utils';

import React, { useEffect, useState } from 'react'
import Track from './Track';

function PlaylistPage({playlistId, updateTrackClicked}:{playlistId:any, updateTrackClicked:any}) {

	const spotifyApi = useSpotify();
	const [playlist, setPlaylist] = useState<any>();
	const [tracks, setTracks] = useState([]);
	const playlistColours = [
	'from-rose-700',
	'from-cyan-400',
	'from-amber-500',
	'from-violet-200',
	'from-stone-500',
	'from-emerald-500',
	'from-violet-600',
	'from-teal-400',
	'from-lime-500',
	'from-indigo-400'
	];
	const randomColour = playlistColours[getRandomNumber()];

	// Fetch everytime we have a new playlis id as we have clicked onto a different
	// playlist
	useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			fetch(`https://api.spotify.com/v1/playlists/${playlistId}?fields=name%2Cimages%2Ctracks%2Curi`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
			})
			.then(result => result.json())
			.then(async(data) => {
				let tracks = data.tracks.items;
				let nextUrl = data.tracks.next;
				let offset = 1;
				
				// If playlist has more than 100 songs we need to loop through the pages to get all the songs
				while (nextUrl) {
					const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=${offset*100}`, {
						method: 'GET',
						headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
					});
					const nextTracks = await response.json();
					tracks = tracks.concat(nextTracks.items);
					offset++;
					nextUrl = nextTracks.next;
				}
				
				setPlaylist(data);
				setTracks(tracks);
			});
		}
	}, [playlistId, spotifyApi]);

	return (
	<div className='text-white pb-36 h-screen overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-neutral-700' >
		{
			playlist &&
			playlist.images &&
			<>
				<div className={`md:flex items-end p-10 bg-gradient-to-b ${randomColour} bg-[#252525]`} >
					<img src={playlist.images[0].url} alt='playlist picture' width={250} height={250} className='rounded-lg' />
					<div className='pl-6 flex-nowrap' >
						<h1 className='font-bold text-4xl lg:text-8xl' >{playlist.name}</h1>
						<p className='pt-3 text-neutral-400' >{playlist.tracks.total} songs</p>
					</div>
				</div>

				<div className='flex justify-between pb-3 pt-3 ml-2 mr-2 mb-2 text-neutral-400 sticky top-0 bg-[#252525] border-b-2 border-neutral-700' >
					<span className='ml-14' >Title</span>
					<span className='ml-7 hidden md:inline' >Album</span>
					<span className='hidden md:inline' >Duration</span>
				</div>

				<div className='bg-opacity-20 bg-[#252525] pl-4' >
					{
						tracks.map((track, index) => (
							<Track track={track} index={index} key={index} updateTrackClicked={updateTrackClicked} playlistUri={playlist.uri} />
						))
					}
				</div>
			</>
		}
	</div>
	)
}

export default PlaylistPage