import { type Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'

// Values from .env
const clientId = Bun.env.SPOTIFY_CLIENT_ID
const clientSecret = Bun.env.SPOTIFY_CLIENT_SECRET
const redirectUri = Bun.env.SPOTIFY_REDIRECT_URI

const scope = 'user-read-private app-remote-control user-library-read' // Scopes needed
const responseType = 'code' // Authorization code flow
const state = 'random_string_or_session_id' // For CSRF protection

//
// initiateOAuth
//
// Helper for constructing the Spotify authorization URL
// Returns the authorization URL.
//
export const initiateOAuth = () => {
  // Check if values from .env
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Spotify client ID, client secret, or redirect URI is missing.');
  }

  // Construct Spotify authorization URL
  const authUrl = `https://accounts.spotify.com/authorize?` +
                  `client_id=${clientId}&` +
                  `response_type=${responseType}&` +
                  `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                  `scope=${encodeURIComponent(scope)}&` +
                  `state=${encodeURIComponent(state)}`;

  return authUrl;
}


//
// isPremium
//
// 
//
export const isPremium = async (accessToken: string) => {
  // API call to 
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  const data = await response.json()
  const plan = await data.product

  return plan === 'premium'
}


//
// getAndSetTokens
//
// Helper for exchanging the auth code for access and refresh tokens, and setting them as cookies.
// After the user signs in with Spotify they are sent to /api/spotify/callback, where getAndSetTokens 
// is called with the context and code, a POST request is made to retrieve the access and refresh tokens
// in exchange for the auth code, and then are set as cookies.
//
// Parameters: c: Context - the Hono context
//             code: string - the auth code
//
export const getAndSetTokens = async (c: Context, code: string) => {
  // Check if values gotten from .env
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Spotify client ID, client secret, or redirect URI is missing.')
  }

  // Create body for post request
  const body = new URLSearchParams({
    code: code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })

  // Post request to exchange the authorization code for an access token
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const data = await response.json()

  // Use Hono's Cookie Helper to set access and refresh tokens in cookies
  // Set Cookie Access token 
  setCookie(c, 'access_token', data.access_token, {
    httpOnly: true,
    secure: false,
    maxAge: 3600, // 1 hour
    path: '/',
    sameSite: 'Strict',
  })

  // Set Cookie Refresh token 
  setCookie(c, 'refresh_token', data.refresh_token, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'Strict',
  })

  return data.access_token
}


// 
// refreshAccessToken
//
// Helper for using the refresh token to obtain a fresh access token.
// If an api call to spotify is being attempted, but the access token can not be "get"
// Then refreshAccessToken is called, which attempts to get the refresh token, if successful,
// then makes a POST request to obtain a fresh acccess token, and sets a new cookie.
// Returns either an object containing the fresh access token, or null, in which the refresh token expired
// or there was an error getting an access token
// 
// Parameters: c: Context - the Hono context
//
export const refreshAccessToken = async (c: Context) => {
  try {
    // Check if values gotten from .env
    if (!clientId || !clientSecret) {
      throw new Error('Spotify client ID or secret is missing.')
    }

    // Get and check refreshToken
    const refreshToken = getCookie(c, 'refresh_token')
    if (!refreshToken) {
      return null;
    }

    // Create body for post request
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    // Post request to get access token with refresh token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to refresh access token:', errorData);
      return null;
    }

    const data = await response.json();

    // Set Cookie Access token
    setCookie(c, 'access_token', data.access_token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600, // 1 hour
      path: '/',
      sameSite: 'Strict',
    });

    // Return the new access token
    return { accessToken: data.access_token };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};