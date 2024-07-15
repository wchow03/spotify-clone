import Spotify from "next-auth/providers/spotify";
import NextAuth from "next-auth/next";
import spotifyApi, { LOGIN_URL } from "@/lib/spotify";

async function refreshAccessToken(token:any) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        // Refreshes access token
        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED ACCESS TOKEN IS: ", refreshedToken);
        
        return {
        ...token,
        accessToken: refreshedToken.access_token,
        accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
        refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        };
    } catch (error) {
        console.log(error);
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        };
    }
}

export default NextAuth({
    providers: [
        Spotify({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
            authorization: LOGIN_URL
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, account, user }:{ token:any, account:any, user:any }) {
            // First login, save access token, refresh token, token expiration time, and user details into JWT
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at * 1000,
                    username: account.providerAccountId
                };
            }

            // Subsequent logins, if access token is still valid, return the JWT
            if (token.accessTokenExpires && Date.now() < +token.accessTokenExpires) {
                return token;
            }

            // Subsequent logins, if access token has expired, try to refresh it
            return await refreshAccessToken(token);
        },
        async session({ session, token }:{ session:any, token:any }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;
            return session;
        }
    }
})