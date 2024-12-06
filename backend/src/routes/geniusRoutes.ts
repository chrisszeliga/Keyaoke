import { Hono } from 'hono'

export const geniusRoutes = new Hono


geniusRoutes.get('/lyrics', async (c) => {
  const artist = c.req.query("artist")
  const track = c.req.query("track")

  if (!artist || !track) {
    return c.text("Artist and track are required", 400)
  }

  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(track)}`)
    
    if (!response.ok) {
      throw new Error(`Error fetching lyrics: ${response.statusText}`)
    }

    const data = await response.json()
    
    return c.json(data)
  } catch (error) {
    console.error(error)
    return c.text("Failed to fetch lyrics", 500)
  }
})