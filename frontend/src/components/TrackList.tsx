import TrackListItem from './TrackListItem'

type Track = {
  name: string
  artist: string
  album: string
  albumImg: string
  uri: string
}

type TrackListProps = {
  tracks: Track[]
}

export default function TrackList({ tracks }: TrackListProps) {
  return (
    <>
      {tracks.length > 0 && (
        <div className="w-full max-w-md mt-4 max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white shadow">
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