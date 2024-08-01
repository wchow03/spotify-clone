import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

function HomePage({ playlistClicked, updateArtistClicked }:{ playlistClicked:any, updateArtistClicked:any }) {

	const spotifyApi = useSpotify();
	const { data:session, status } = useSession();
	const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
	const [artists, setArtists] = useState([]);

	const fetchFeaturedPlaylists = () => {
		fetch('https://api.spotify.com/v1/browse/featured-playlists?limit=50', {
			method: 'GET',
			headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
		})
		.then(result => result.json())
		.then(async(data) => {
			let playlists = data?.playlists?.items;
			let nextUrl = data?.playlists?.next;
			let offset = 1;

			while (nextUrl) {
				const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?limit=50&offset=${offset*50}`, {
					method: 'GET',
					headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
				});
				const nextPlaylists = await response.json();
				playlists = playlists.concat(nextPlaylists.playlists.items);
				offset++;
				nextUrl = nextPlaylists.playlists.next;
			}

			setFeaturedPlaylists(playlists);
		});
	};

	const fetchFollowedArtists = () => {
		fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', {
			method: 'GET',
			headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
		})
		.then(result => result.json())
		.then(async(data) => {
			let tempArtists = data?.artists?.items;
			let nextUrl = data?.artists?.next;
			let offset = 1;

			while (nextUrl) {
				const response = await fetch(`https://api.spotify.com/v1/me/following?type=artist&limit=50&offset=${offset*50}`, {
					method: 'GET',
					headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
				});
				const nextArtists = await response.json();
				tempArtists = tempArtists.concat(nextArtists.artists.items);
				offset++;
				nextUrl = nextArtists.artists.next;
			}
			setArtists(tempArtists);
		});
	};
	
	useEffect(() => {
		fetchFeaturedPlaylists();
		fetchFollowedArtists();
	}, [spotifyApi, session])

	return (
		<div className="h-screen overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-neutral-700 text-white" >
			<div className="flex flex-wrap pl-2" >
				{
					artists &&
					artists.map((artist:any) => (
						<div key={artist.id} 
							className="text-center cursor-pointer hover:bg-[#c7c7c7] hover:bg-opacity-5 rounded mt-2"
							onClick={() => updateArtistClicked(artist.id)}
						>
							<Image src={artist.images[0].url} alt="artist profile" width={125} height={125} className="rounded-full mt-5 pl-2 pr-2 w-32" />
							<h1 className="text-nowrap truncate" >{artist.name}</h1>
						</div>
					))
				}
			</div>
			<div className='flex flex-wrap pb-40 pl-2'>
				{
					featuredPlaylists &&
					featuredPlaylists.map((playlist:any) => (
						<div className="w-60 mt-5 pl-2 pt-2 cursor-pointer hover:bg-[#c7c7c7] hover:bg-opacity-5 rounded" 
							key={playlist.id}
							onClick={() => playlistClicked(playlist.id)}
						>
							<Image src={playlist.images[0].url} alt='playlist picture' width={125} height={125} className='rounded-md' />
							<h1 className="text-nowrap truncate" >{playlist.name}</h1>
						</div>
					))
				}
			</div>
		</div>
	);
}

export default HomePage;