import keyboardLogo from '../assets/keyboardlogo.png'
import { useState } from 'react'

export default function UpgradePage() {
  const [gradient, setGradient] = useState('')

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    // Get the center of the element relative to the mouse position
    const x = (clientX / window.innerWidth) * 100
    const y = (clientY / window.innerHeight) * 100

    // Set up the radial gradient, the gradient will follow the mouse position
    setGradient(`radial-gradient(circle at ${x}% ${y}%, rgba(71, 85, 105, 0.3), rgba(30, 41, 59, 0.4))`)
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen space-y-16' onMouseMove={handleMouseMove}>
      {/* Logo */}
      <div className='flex justify-center items-center'>
        <img src={keyboardLogo} className='w-24 h-24 object-contain mr-2'/>
        <h1 className='text-7xl font-lexend text-gray-200 tracking-tighter'>
          keyaoke<span className='cursor'>_</span>
        </h1>
      </div>
      {/* Info */}
      <div 
        className='bg-gray-800 text-gray-200 font-mono p-8 rounded-3xl sm:w-1/2 lg:w-2/5 transition-all duration-300'
        style={{ backgroundImage: gradient }}
      >
        <p className='mb-5'>
          Oops! <span className='font-bold'>Keyaoke </span> 
          requires a Spotify Premium account for the use of Spotify's Web Playback SDK to stream music.
        </p>
        <p className='text-center'>
          Upgrade to Premium:&nbsp;
          <a 
            href='https://www.spotify.com/us/premium/'
            target='_blank'
            rel='noopener noreferrer' 
            className='text-blue-500 underline'
          >
            Spotify Premium
          </a>
        </p>
      </div>
    </div>
  )
    
}