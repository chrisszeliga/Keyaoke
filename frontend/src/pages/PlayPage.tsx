import SpotifyPlayer from 'react-spotify-web-playback'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

import LyricTyper from '../components/LyricTyper'

type Track = {
  name: string
  artist: string
  album: string
  albumImg: string
  uri: string
  duration: number
}

export default function PlayPage() {
  const location = useLocation()
  const track = location.state as Track
  const [accessToken, setAccessToken] = useState('')

  // Get access token once, after the component mounts
  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch('/api/spotify/access-token')
        const data = await response.json()
        setAccessToken(data)
      } catch (error) {
        console.error('Failed to fetch access token:', error)
      }
    }
  
    fetchToken()
  }, [])
  
  return (
    <>
      <LyricTyper track={track}/>
      <div className="border-4 border-gray-800 rounded-2xl mb-8 w-[650px] h-[88px] fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center">
        <SpotifyPlayer
          token={accessToken}
          uris={track.uri ? [track.uri] : []}
          autoPlay
          play
          initialVolume={0.25}
          styles={{
            activeColor: '#1db954',
            bgColor: '#1f2937',
            color: '#fff',
            loaderColor: '#fff',
            sliderColor: '#1db954',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
            sliderTrackColor: '#535353',
            sliderHandleColor: '#fff',
          }}
        />
      </div>
    </>
  )
}