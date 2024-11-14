import { useState } from 'react';
import SearchBar from '../components/SearchBar'
import TrackList from '../components/TrackList'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tracks, setTracks] = useState<any[]>([])

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery} 
        setTracks={setTracks}
      />
      <TrackList tracks={tracks}/>
    </div>
  );
}