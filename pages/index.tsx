// 'use client';
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable"
import Sidebar from "@/components/Sidebar";
import HomePage from "@/components/HomePage";
import BrowsePage from "@/components/BrowsePage";
import PlaylistPage from "@/components/PlaylistPage";
import ArtistPage from "@/components/ArtistPage";
import Player from "@/components/Player";
import AlbumPage from "@/components/AlbumPage";

export default function Dashboard() {

	const [home, setHome] = useState(true);
	const [browse, setBrowse] = useState(false);
	const [playlist, setPlaylist] = useState(false);
	const [playlistId, setPlaylistId] = useState<number | null>(null);
	const [trackClicked, setTrackClicked] = useState(false);
	const [artistClicked, setArtistClicked] = useState(false);
	const [artist, setArtist] = useState<number | null>(null);
	const [albumClicked, setAlbumClicked] = useState(false);
	const [album, setAlbum] = useState<number | null>(null);

	const homeClicked = () => {
		setHome(true);
		setBrowse(false);
		setPlaylist(false);
		setArtistClicked(false);
		setAlbumClicked(false);
	};

	const browseClicked = () => {
		setBrowse(true);
		setHome(false);
		setPlaylist(false);
		setArtistClicked(false);
		setAlbumClicked(false);
	};

	const playlistClicked = (id: number) => {
		setPlaylist(true);
		setHome(false);
		setBrowse(false);
		setArtistClicked(false);
		setAlbumClicked(false);
		
		setPlaylistId(id)
	};

	const updateTrackClicked = () => {
		setTrackClicked(!trackClicked);
	};

	const updateArtistClicked = (id: number) => {
		setArtistClicked(true);
		setPlaylist(false);
		setHome(false);
		setBrowse(false);
		setAlbumClicked(false);
		setArtist(id);
	};

	const updateAlbumClicked = (id: number) => {
		setAlbumClicked(true);
		setPlaylist(false);
		setHome(false);
		setBrowse(false);
		setArtistClicked(false);
		setAlbum(id);
	};

	return (
		<>
		<ResizablePanelGroup
			direction="horizontal"
			className="h-screen bg-[#252525]"
			>
			<ResizablePanel defaultSize={15} minSize={10} maxSize={90} >
				<Sidebar homeClicked={homeClicked} browseClicked={browseClicked} playlistClicked={playlistClicked} />
			</ResizablePanel>
			<ResizableHandle className="bg-black pr-2" />
			<ResizablePanel defaultSize={85}>
				<div className="h-screen relative" >
					{home && <HomePage playlistClicked={playlistClicked} updateArtistClicked={updateArtistClicked} />}
					{browse && <BrowsePage updateTrackClicked={updateTrackClicked} updateAlbumClicked={updateAlbumClicked} playlistClicked={playlistClicked} updateArtistClicked={updateArtistClicked}/>}
					{playlist && <PlaylistPage playlistId={playlistId} updateTrackClicked={updateTrackClicked} />}
					{artistClicked && <ArtistPage artistID={artist} updateTrackClicked={updateTrackClicked} updateAlbumClicked={updateAlbumClicked} />}
					{albumClicked && <AlbumPage albumID={album} updateTrackClicked={updateTrackClicked} />}
					<Player trackClicked={trackClicked} />
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
			</>
	);
}