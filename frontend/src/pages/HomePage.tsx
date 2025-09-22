import { useState } from "react"
import spotifyLogo from "../assets/spotifylogo.png"
import keyboardLogo from "../assets/keyboardlogo.png"

export default function HomePage() {
  const [gradient, setGradient] = useState("")

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth) * 100
    const y = (clientY / window.innerHeight) * 100
    setGradient(
      `radial-gradient(circle at ${x}% ${y}%, rgba(71, 85, 105, 0.3), rgba(30, 41, 59, 0.4))`
    )
  }

  const handleLogin = () => {
    window.location.href = `/api/spotify/login`
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen space-y-12 p-6"
      onMouseMove={handleMouseMove}
    >
      {/* Logo */}
      <div className="flex justify-center items-center">
        <img
          src={keyboardLogo}
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain mr-2"
        />
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-lexend text-gray-200 tracking-tighter text-center">
          keyaoke<span className="cursor">_</span>
        </h1>
      </div>

      {/* Spotify Login */}
      <div
        className="bg-gray-800 text-gray-200 font-mono p-6 sm:p-8 rounded-3xl w-full max-w-3xl flex flex-col sm:flex-row justify-center items-center transition-all duration-300"
        style={{ backgroundImage: gradient }}
      >
        <div className="flex-1 mx-2 sm:mx-4">
          <p className="mb-3">
            Sign in with your Spotify Premium account to access Keyaoke:
          </p>
          <ul className="list-disc pl-5 text-sm sm:text-base">
            <li>A Spotify Premium account is required for audio streaming.</li>
          </ul>
        </div>
        <div className="flex flex-col items-center mt-6 sm:mt-0">
          <img
            src={spotifyLogo}
            className="w-40 sm:w-52 lg:w-64 mb-2 object-contain cursor-pointer"
            onClick={handleLogin}
          />
          <p className="text-gray-300 text-sm sm:text-base">
            Click to Login with Spotify!
          </p>
        </div>
      </div>

      {/* Info */}
      <div
        className="bg-gray-800 text-gray-200 font-mono p-6 sm:p-8 rounded-3xl w-full max-w-3xl transition-all duration-300"
        style={{ backgroundImage: gradient }}
      >
        <p className="mb-5 text-sm sm:text-base leading-relaxed">
          <span className="font-bold">Keyaoke </span>
          is a typing game where you type the lyrics of songs as they play. 
          Test your typing speed and accuracy while keeping up with the rhythm of your favorite tracks. 
          With Spotify integration, you can choose the songs you enjoy and type along with their lyrics, 
          making typing practice and music more engaging.
        </p>
        <p className="text-center text-sm sm:text-base">
          Supported Browsers:&nbsp;
          <a
            href="https://developer.spotify.com/documentation/web-playback-sdk#supported-browsers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Spotify Developer Documentation
          </a>
        </p>
      </div>
    </div>
  )
}
