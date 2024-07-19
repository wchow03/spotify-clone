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
import Player from "@/components/Player";

export default function Dashboard() {

	const [home, setHome] = useState(true);
	const [browse, setBrowse] = useState(false);
	const [playlist, setPlaylist] = useState(false);
	const [playlistId, setPlaylistId] = useState<number | null>(null);
	const [trackClicked, setTrackClicked] = useState(false);

	const homeClicked = () => {
		setHome(true);
		setBrowse(false);
		setPlaylist(false);
	}

	const browseClicked = () => {
		setBrowse(true);
		setHome(false);
		setPlaylist(false);
	}

	const playlistClicked = (id: number) => {
		setPlaylist(true);
		setHome(false);
		setBrowse(false);
		
		setPlaylistId(id)
	}

	const updateTrackClicked = () => {
		setTrackClicked(!trackClicked);
	}

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
					{home && <HomePage playlistClicked={playlistClicked} />}
					{browse && <BrowsePage />}
					{playlist && <PlaylistPage playlistId={playlistId} updateTrackClicked={updateTrackClicked} />}
					{/* artist clicked, album clicked */}
					<Player trackClicked={trackClicked} />
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
			</>
	);
}