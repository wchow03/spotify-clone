import React, { useCallback, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import useSpotify from '@/hooks/useSpotify';
import { debounce } from '@mui/material';
import Track from './Track';
import Image from "next/image";

function Browse({updateTrackClicked, updateAlbumClicked, playlistClicked, updateArtistClicked}:{updateTrackClicked:any, updateAlbumClicked:any, playlistClicked:any, updateArtistClicked:any}) {

	const spotifyApi = useSpotify();
	const [search, setSearch] = useState('');
	const [results, setResults] = useState<any>([]);

	useEffect(() => {
		debouncedSearch(search);
	}, [spotifyApi, search]);

	const debouncedSearch = useCallback(
		debounce((search: string) => {
			setSearch(search);
			fetch(`https://api.spotify.com/v1/search?q=${search}&type=album%2Cplaylist%2Ctrack%2Cartist&limit=15`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
			})
			.then(result => result.json())
			.then(data => setResults(data));
		}, 500),
	[]);

	console.log(results);
	
	return (
		<div className='text-white pb-36 pl-4 h-screen overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-neutral-700' >
			<div className='p-2 w-1/2' >
				<Input className='bg-[#3a3a3a] border-none outline-none' placeholder='Search' onChange={(e) => setSearch(e.target.value)} />
			</div>
			{
				results.albums &&
				results.artists &&
				results.playlists &&
				results.tracks &&
				<>
					<h1 className='font-bold text-3xl mb-2' >Songs</h1>
					<div className='mb-5' >
						{
							results.tracks.items.map((track:any, index:number) => (
								<Track track={track} offset={track.track_number} index={index+1} key={index+1} updateTrackClicked={updateTrackClicked} playlistUri={track.album.uri} />
							))
						}
					</div>

					<h1 className='font-bold text-3xl' >Artists</h1>
					<div className='flex flex-wrap mb-5' >
						{
							results.artists.items.map((artist:any) => (
								<div key={artist.id} 
									className="text-center cursor-pointer hover:bg-[#c7c7c7] hover:bg-opacity-5 rounded-md pb-2"
									onClick={() => updateArtistClicked(artist.id)}
								>
									{
										artist.images.length > 0 &&
										<Image src={artist.images[0].url} alt="artist profile" width={125} height={125} className="rounded-full mt-5 pl-2 pr-2 w-32" />
									}
									<h1 className="text-nowrap truncate" >{artist.name}</h1>
								</div>
							))
						}
					</div>

					<h1 className='font-bold text-3xl' >Albums</h1>
					<div className='flex flex-wrap mb-5' >
						{
							results.albums.items.map((album:any, index:number) => (
								<div className="p-5 w-52 hover:bg-[#c7c7c7] hover:bg-opacity-5 cursor-pointer rounded-md" key={index}
									onClick={() => updateAlbumClicked(album.id)}
								>
									<Image src={album.images[0].url} alt="album cover" width={150} height={150} className="rounded" />
									<h1 className="truncate text-nowrap pt-2" >{album.name}</h1>
								</div>
							))
						}
					</div>

					<h1 className='font-bold text-3xl' >Playlists</h1>
					<div className='flex flex-wrap' >
						{
							results.playlists.items.map((playlist:any) => (
								<div className="w-52 p-5 cursor-pointer hover:bg-[#c7c7c7] hover:bg-opacity-5 rounded-md" 
									key={playlist.id}
									onClick={() => playlistClicked(playlist.id)}
								>
									<Image src={playlist.images[0].url} alt='playlist picture' width={150} height={150} className='rounded-md' />
									<h1 className="text-nowrap truncate" >{playlist.name}</h1>
								</div>
							))
						}
					</div>
				</>
			}
		</div>
	);
}

export default Browse