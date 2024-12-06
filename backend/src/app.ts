import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'

import { spotifyRoutes } from './routes/spotifyRoutes'
import { geniusRoutes } from './routes/geniusRoutes'

const app = new Hono()

app.use(logger())

app.route('/api/spotify', spotifyRoutes)
app.route('/api/genius', geniusRoutes)

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

export default app