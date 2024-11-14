type Track = {
  name: string
  artist: string
  album: string
  albumImg: string
  uri: string
}

import { useLocation } from 'react-router-dom'

export default function PlayPage() {
  const location = useLocation();
  const track = location.state as Track
  
  return <p> {track.name} </p>
}