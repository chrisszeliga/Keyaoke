import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { initiateOAuth, isPremium, getAndSetTokens, refreshAccessToken } from '../controllers/oauthController'


export const spotifyRoutes = new Hono


//
// /login route
//
// Where the user gets redirected to when pressing "Login with Spotify."
// Starts the OAuth process, where initiateOAuth creates the authorization URL
// which the user is redirected to. 
//
spotifyRoutes.get('/login', (c) => {
  const authUrl = initiateOAuth()
  return c.redirect(authUrl)
})


//
// /callback route
//
// Where Spotify redirects user when logging in.
// Retrieves code in url, calls getAndSetTokens which sets cookies for
// access and refresh token, then redirects to the play page.
//
spotifyRoutes.get('/callback', async (c) => {
  // Check if user has premium
  const premium = await isPremium(c)
  if (premium !== 'premium')
    return c.redirect('/upgrade')

  // Get the authorization code from the URL
  const code = c.req.query('code')

  // Check if code
  if (!code) {
    return c.text('Authorization code missing', 400)
  }

  try {
    // Get and set access and refresh token cookies 
    await getAndSetTokens(c, code)

    // Redirect to the /search page
    return c.redirect('/search')
  } catch (error) {
    return c.text('Error getting and setting tokens to cookies', 500)
  }
})


//
// /search route
//
//
//
spotifyRoutes.get('/search', async (c) => {
  const query = c.req.query('query')

  if (!query ) {
    return c.text('Missing query', 400)
  }

  let accessToken = getCookie(c, 'access_token')

  // If no access token, get fresh access token with refresh token
  // If could not get fresh access token (refresh token expired) then return to login page.
  if (!accessToken) {
    const refreshed = await refreshAccessToken(c)
    if (!refreshed || !refreshed.accessToken) {
      return c.redirect('/')
    }
    // Use the refreshed access token directly
    accessToken = refreshed.accessToken
  } else {
    accessToken = getCookie(c, 'access_token')
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      // Extract tracks from the response
      const tracks = data.tracks.items.map((track: any) => ({
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumImg: track.album.images[0].url,
        uri: track.uri
      }))
      
      return c.json(tracks)
    } else {
      return c.text('Error searching for tracks', 500)
    }
  } catch (error) {
    console.error('Error querying Spotify API:', error)
    return c.text('Error querying Spotify', 500)
  }
})


//
// /access-token route
//
//
//
spotifyRoutes.get('/access-token', async (c) => {
  let accessToken = getCookie(c, 'access_token')

  // If no access token, get fresh access token with refresh token
  // If could not get fresh access token (refresh token expired) then return to login page.
  if (!accessToken) {
    const refreshed = await refreshAccessToken(c)
    if (!refreshed || !refreshed.accessToken) {
      return c.redirect('/')
    }
    // Use the refreshed access token directly
    accessToken = refreshed.accessToken
  } else {
    accessToken = getCookie(c, 'access_token')
  }
  return c.json(accessToken)
})
