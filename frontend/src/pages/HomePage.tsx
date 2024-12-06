import { useState } from 'react'
import spotifyLogo from '../assets/spotifylogo.png'
import keyboardLogo from '../assets/keyboardlogo.png'

export default function HomePage() {
  const [gradient, setGradient] = useState('')

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    // Get the center of the element relative to the mouse position
    const x = (clientX / window.innerWidth) * 100
    const y = (clientY / window.innerHeight) * 100

    // Set up the radial gradient, the gradient will follow the mouse position
    setGradient(`radial-gradient(circle at ${x}% ${y}%, rgba(71, 85, 105, 0.3), rgba(30, 41, 59, 0.4))`)
  }

  const handleLogin = () => {
    window.location.href = `/api/spotify/login`
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-16 p-6' onMouseMove={handleMouseMove}>

      {/* Logo */}
      <div className='flex justify-center items-center'>
        <img src={keyboardLogo} className='w-24 h-24 object-contain mr-2'/>
        <h1 className='text-7xl font-lexend text-gray-200 tracking-tighter'>
          keyaoke<span className='cursor'>_</span>
        </h1>
      </div>

      {/* Spotify Login */}
      <div 
        className='bg-gray-800 text-gray-200 font-mono p-8 rounded-3xl sm:w-1/2 lg:w-2/5 flex flex-row justify-center items-center transition-all duration-300'
        style={{ backgroundImage: gradient }}
      >
        <div className='flex-1 w-1/2 mx-4'>
          <p className='mb-3'>Sign in with your Spotify Premium account to access Keyaoke:</p>
          <ul className="list-disc pl-5">
            <li>A Spotify Premium account is required audio streaming.</li>
          </ul>
        </div>
        <div className='flex-col'>
          <img src={spotifyLogo} className='w-64 ml-8 mr-10 mb-2 object-contain cursor-pointer' onClick={handleLogin}/>
          <p className='flex justify-center text-gray-300'>Click to Login with Spotify!</p>
        </div>
      </div>

      {/* Info */}
      <div 
        className='bg-gray-800 text-gray-200 font-mono p-8 rounded-3xl sm:w-1/2 lg:w-2/5 transition-all duration-300'
        style={{ backgroundImage: gradient }}
      >
        <p className='mb-5'>
          <span className='font-bold'>Keyaoke </span> 
          is a typing game where you type the lyrics of songs as they play. 
          You can test your typing speed and accuracy while keeping up with the rhythm of your favorite tracks. 
          With Spotify integration, you can pick songs you enjoy and type along with their lyrics, 
          making typing and music learning engaging.
        </p>
        <p className='text-center'>
          Supported Browsers:&nbsp;
          <a 
            href='https://developer.spotify.com/documentation/web-playback-sdk#supported-browsers'
            target='_blank'
            rel='noopener noreferrer' 
            className='text-blue-500 underline'
          >
            Spotify Developer Documentation
          </a>
        </p>
      </div>
    </div>
  )
}
