'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Separator } from "../components/ui/separator";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Logout from './Logout';
import { Avatar } from '@mui/material';
import useSpotify from '../hooks/useSpotify';

function Sidebar({homeClicked, browseClicked, playlistClicked}:{homeClicked:any, browseClicked:any, playlistClicked:any}) {

    const { data: session, status } = useSession();
    // console.log("Client Session", session);
    const spotifyApi = useSpotify();
    const [playlists, setPlaylists] = useState([]);

    /**
     * TODO: Add albums as well as playlists later
     * const [albums, setAlbums] = useState([]);
     */

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            fetch("https://api.spotify.com/v1/me/playlists", {
                method: 'GET',
                headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` }
            })
            .then(result => result.json())
            .then(data => setPlaylists(data.items));
        }
    }, [session, spotifyApi]);
    // console.log(playlists);

    return (
        <div className="ml-4 h-screen text-white overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-neutral-700">
        
            <div className="sticky top-0 pb-3 bg-[#252525]" >
                {
                    session &&
                    <div className='flex pb-2 pt-4' >
                        <Avatar alt='Account' src={session.user?.image!} sx={{width:30, height:30}} />
                        <span className='pl-3 font-bold text-nowrap cursor-default' >{session.user?.name}</span>
                    </div>
                }

                <Logout />

                <div onClick={homeClicked} className='cursor-pointer rounded hover:bg-[#c7c7c7] hover:bg-opacity-5' >
                    <div className='p-2' >
                        <HomeOutlinedIcon />
                        <span className='pl-3 font-bold' >Home</span>
                    </div>
                </div>

                <div onClick={browseClicked} className='cursor-pointer rounded hover:bg-[#c7c7c7] hover:bg-opacity-5' >
                    <div className='p-2' >
                        <SearchOutlinedIcon />
                        <span className='pl-3 font-bold' >Search</span>
                    </div>
                </div>

                <Separator className="my-3" />

                <div className='cursor-default' >
                    <span className="font-medium text-xl">Playlists</span>
                </div>
            </div>
        
            {
                playlists && 
                <div className='mb-3' >
                    {
                        playlists.map((playlist: any) => (
                            <div key={playlist.id} 
                                className='flex cursor-pointer p-2 items-center rounded hover:bg-[#c7c7c7] hover:bg-opacity-5' 
                                onClick={() => playlistClicked(playlist.id)}
                            >
                                <img src={playlist.images[0].url} alt='playlist picture' width={50} height={50} className='rounded-md' />
                                <span className='pl-3 truncate font-medium' >{playlist.name}</span>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
)}

export default Sidebar;