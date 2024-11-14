import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { spotifyRoutes } from './routes/spotifyRoutes';

const app = new Hono()

app.use(logger())

app.route('/api/spotify', spotifyRoutes)

export default app