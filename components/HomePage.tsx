import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

function HomePage({ playlistClicked }:{ playlistClicked:any }) {

	const spotifyApi = useSpotify();
	const { data:session, status } = useSession();
	const [featuredPlaylists, setFeaturedPlaylists] = useState([]);

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
			console.log(data);
		});
	};

	console.log("Featured Playlists", featuredPlaylists);
	
	useEffect(() => {
		fetchFeaturedPlaylists();
	}, [spotifyApi, session])

	return (
		<div className='text-white h-screen overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-neutral-700 flex flex-wrap pb-40 pl-10'>
			{
				featuredPlaylists &&
				featuredPlaylists.map((playlist:any) => (
					<div className="w-60 mt-5 pl-2 pt-2 cursor-pointer hover:bg-[#c7c7c7] hover:bg-opacity-5 flex-nowrap justify-center items-center rounded" 
						key={playlist.id}
						onClick={() => playlistClicked(playlist.id)}
					>
						<Image src={playlist.images[0].url} alt='playlist picture' width={125} height={125} className='rounded-md' />
						<h1 className="text-nowrap truncate" >{playlist.name}</h1>
					</div>
				))
			}
		</div>
	);
}

export default HomePage;