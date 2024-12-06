import { useState } from 'react'

type Track = {
  name: string
  artist: string
  album: string
  albumImg: string
  uri: string
  duration: number
}

type SearchBarProps = {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>
}

export default function SearchBar({ searchQuery, setSearchQuery, setTracks }: SearchBarProps) {
  // State for keeping track of the Timeout ID.
  const [debounceTimeout, setDebounceTimeout] = useState<Timer | null>(null)

  //
  // handleSearch
  //
  // 
  //
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // If there is a previous timeout ID, clear it to restart process
    if (debounceTimeout)
      clearTimeout(debounceTimeout)

    // Set a new timeout to handle a delay before API call is made.
    // Done to reduce and eliminate repetitive API calls.
    const timeout = setTimeout(async () => {
      // Make api call as long as two characters have been entered
      if (query.length >= 2) {
        const response = await fetch(`/api/spotify/search?query=${query}`)
        const data = await response.json()

        setTracks(data)
      }
    }, 500) // half second delay

    setDebounceTimeout(timeout)
  }

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearch}
      className="bg-gray-700 text-gray-200 p-6 rounded-3xl w-1/4 h-16 focus:outline-none text-xl"
      placeholder="Search for a song"
    /> 
  )
}
      