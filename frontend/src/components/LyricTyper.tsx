import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Track = {
  name: string
  artist: string
  album: string
  albumImg: string
  uri: string
  duration: number
}

type LyricTyperProps = {
  track: Track
}


export default function LyricTyper ({ track }: LyricTyperProps) {
  const navigate = useNavigate()

  // State for Lyriccs
  const [lyrics, setLyrics] = useState<string[]>([])
  const [totalWords, setTotalWords] = useState(0)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isCorrect, setIsCorrect] = useState(true)

  // State for Timer
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  // Reference to tags
  const lyricsContainerRef = useRef<HTMLDivElement>(null)
  const currentLineRef = useRef<HTMLDivElement>(null)

  // State for Errors
  const [lastIndex, setLastIndex] = useState(0)
  const [errors, setErrors] = useState(0)

  // State for whether game is done or not
  const [isGameOver, setIsGameOver] = useState(false)


  // Get lyrics for track once, after the component mounts
  useEffect(() => {
    async function fetchLyrics() {
      try {
        const response = await fetch(`/api/genius/lyrics?artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch lyrics')
        }
      
        const data = await response.json()
        const uncleanedLyrics = data.lyrics as string
        
        if (!uncleanedLyrics) {
          throw new Error('No lyrics found')
        }
        
        // Clean lyrics of return carriage, new lines, empty lines, and 
        // bugged characters from the lyrics API
        const cleanLyrics = uncleanedLyrics
          .split(/\r?\n/)
          .map(line => line.replace(//g, "").trim()) // Remove the symbol
          .filter(line => line !== "")

        setLyrics(cleanLyrics)

        // Get total words for calculating words per min (wpm)
        setTotalWords(cleanLyrics.join(' ').split(' ').filter(word => word !== '').length)
      } catch (error) {
        console.error('Error fetching lyrics:', error)
        setLyrics([])
      }
    }
  
    fetchLyrics()
  }, [])


  // Sets up a timer for determining how long it took the user to type the lyrics
  // As long as isRunning remains true, the timer keeps running.
  useEffect(() => {
    if (!isRunning) return
    
    // Interval runs every 100 milliseconds, updating the elapsedTime state by 1
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 100)

    // clean-up function
    return () => clearInterval(interval)
  }, [isRunning])


  // Automatic scroller, so that when correctly inputs a lyric line, the lyrics
  // dont fall behind and are centered.
  useEffect(() => {
    // Scroll current line into view whenever it changes
    if (currentLineRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current
      const element = currentLineRef.current
      const elementRect = element.getBoundingClientRect()
      
      // Calculate the scroll position to center the current line
      const scrollPosition = element.offsetTop - container.offsetTop - 
        (container.clientHeight / 2) + (elementRect.height / 2)
      
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [currentLineIndex])


  // Handler for handling input change
  // Checks if inputted line is correct or so far correct (and also incorrect)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setTypedText(input)

    const currentLine = lyrics[currentLineIndex]

    // If the text input is equal to the current lyric line
    // Then check either if its the last lyric line, if it is then set timer off and set game end to true.
    // Also check if the index of the current line is valid
    if(input === currentLine) {
      // Check if last lyric line
      if (currentLineIndex == lyrics.length - 1) {
        setIsRunning(false)
        setIsGameOver(true)
      }
      // Check if current line is valid line
      if (currentLineIndex <= lyrics.length - 1) {
        setCurrentLineIndex(prev => prev + 1)
        setTypedText('')
        setIsCorrect(true)
      }
    } else {
      // If the input for the current line is correct then set to true
      // Else there is an error
      if (input === currentLine.slice(0, input.length)) {
        setIsCorrect(true)
      } else {
        setIsCorrect(false)
        // If the user backspaces, then it wont count as an error
        if (input.length > lastIndex) {
          setErrors((prev) => prev + 1)
        }
      }
    }
    setLastIndex(input.length)
  }


  // Handler for navigating back to search page
  const goToSearch = () => {
    navigate('/search')
  }


  return (
    <>
      <div className="w-full max-w-2xl mx-auto mt-6">
        {/* Lyrics Display */}
        <div 
          ref={lyricsContainerRef}
          className="bg-gray-900 p-6 rounded-lg font-mono whitespace-pre-line overflow-y-auto scrollbar-hide"
          style={{ maxHeight: 'calc(100vh - 260px)' }}
        >
          {lyrics.length === 0 ? (
            <div className="text-gray-500 text-center">
              No lyrics found. Please try a different song.
            </div>
          ) : (
            lyrics.map((line, index) => (
              <div
                key={index}
                ref={index === currentLineIndex ? currentLineRef : null}
                className={`py-1 ${
                  index === currentLineIndex 
                    ? 'text-white'
                    : index < currentLineIndex 
                      ? 'text-green-500'
                      : 'text-gray-500'
                }`}
              >
                {line}
              </div>
            ))
          )}
        </div>       

        {/* Typing Input */}
        <div className="fixed bottom-40 left-1/2 transform -translate-x-1/2 w-4/5 sm:w-4/5 md:w-2/3 lg:w-1/3">
          <input
            type="text"
            value={typedText}
            onChange={handleInputChange}
            className={`w-full p-3 bg-gray-800 rounded-lg font-mono focus:outline-none focus:ring-2 ${
              isCorrect 
                ? 'text-white focus:ring-blue-500' 
                : 'text-red-500 focus:ring-red-500'
            }`}
            placeholder="Type the current line."
            disabled={isGameOver || lyrics.length === 0}
            autoFocus
          />
        </div>
      </div>


      {isGameOver && (
        <div className="bg-black bg-opacity-50 text-gray-200 fixed inset-0 flex justify-center items-center z-5">
          {/* End Game Popup */}
          <div className="flex flex-col items-center justify-center bg-gray-800 p-10 rounded-2xl shadow-lg w-96 text-lg font-mono">
            <div className="space-y-3 w-full">
              <div className='flex flex-row justify-start items-center w-full'>
                <p className='flex-1'>time taken:</p>
                <p
                  className={`${
                    ((track.duration + 5) / 1000) > (elapsedTime / 10)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {(elapsedTime / 10).toFixed(2)} secs
                </p>
              </div>
              <div className='flex flex-row justify-start items-center w-full'>
                <p className='flex-1'>errors:</p>
                <p className='text-red-500'> {errors.toFixed(2)} </p>
              </div>
              <div className='flex flex-row justify-start items-center w-full'>
                <p className='flex-1'>wpm:</p>
                <p> {(totalWords / (elapsedTime / (10 * 60))).toFixed(2)} </p>
              </div>
            </div>
            <button className='bg-gray-600 hover:bg-gray-500 p-3 rounded-3xl mt-10' onClick={goToSearch}>
              back to search
            </button>
          </div>
        </div>
      )}
    </>
  )
}