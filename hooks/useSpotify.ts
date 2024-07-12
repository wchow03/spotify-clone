import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET
});

function useSpotify() {
    const { data: session, status } = useSession();
    const convertSession: any = session;

    useEffect(() => {
        if (convertSession) {
            if (convertSession.error === "RefreshAccessTokenError") {
                signIn();
            }

            spotifyApi.setAccessToken(convertSession.user.accessToken);
        }
    }, [session]);

    return spotifyApi;
}

export default useSpotify;