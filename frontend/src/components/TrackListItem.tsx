import { useNavigate } from 'react-router-dom'

type Track = {
  name: string
  artist: string
  album: string
  albumImg: string
  uri: string
  duration: number
}

type TrackListItemProps = {
  track: Track
  index: number
}

export default function TrackListItem({ track }: TrackListItemProps) {
  const navigate = useNavigate()

  const goToPlay = () => {
    navigate('/play', { state: track })
  }

  return (
  <li onClick={goToPlay} className="flex items-center p-2 cursor-pointer hover:bg-gray-800 rounded-lg">
    <img
      src={track.albumImg}
      alt={track.name}
      className="w-12 h-12 mr-4"
    />
    <div className="flex flex-col">
      <span className="font-bold">{track.name}</span>
      <span className="text-sm text-gray-400">{track.artist}</span>
    </div>
  </li>
  )
}
