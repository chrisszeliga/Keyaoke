import TrackListItem from './TrackListItem'

type Track = {
  name: string
  artist: string
  album: string
  albumImg: string
  uri: string
  duration: number
}

type TrackListProps = {
  tracks: Track[]
}

export default function TrackList({ tracks }: TrackListProps) {
  return (
    <>
      {tracks.length > 0 && (
        <div className="w-full max-w-md mt-4 p-2 max-h-[400px] overflow-y-auto border rounded-lg border-gray-700 bg-gray-600 text-gray-200 shadow scrollbar-hide">
          <ul className="space-y-2">
            {tracks.map((track, index) => (
              <TrackListItem key={track.uri} track={track} index={index} />
            ))}
          </ul>
        </div>
      )}
    </>
  )
}