import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import TrackList from '../components/TrackList'
import keyboardLogo from '../assets/keyboardlogo.png'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tracks, setTracks] = useState<any[]>([])

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      {/* Logo */}
      <div className='flex justify-center items-center mb-2'>
        <img src={keyboardLogo} className='w-24 h-24 object-contain mr-2'/>
        <h1 className='text-7xl font-lexend text-gray-200 tracking-tighter'>
          keyaoke<span className='cursor'>_</span>
        </h1>
      </div>
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery} 
        setTracks={setTracks}
      />
      <TrackList tracks={tracks}/>
    </div>
  )
}