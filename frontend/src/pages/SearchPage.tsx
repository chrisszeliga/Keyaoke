import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import TrackList from '../components/TrackList'
import keyboardLogo from '../assets/keyboardlogo.png'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tracks, setTracks] = useState<any[]>([])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        {/* Logo */}
        <div className='flex justify-center items-center mb-2'>
            <img src={keyboardLogo} className='w-20 h-20 sm:w-24 sm:h-24 lg:w-28 object-contain'/>
            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-lexend text-gray-200 tracking-tighter text-center'>
                keyaoke<span className='cursor'>_</span>
            </h1>
        </div>

        {/* Search Bar */}
        <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} 
            setTracks={setTracks}
        />

        {/* Track List */}
        <TrackList tracks={tracks}/>
    </div>
  )
}