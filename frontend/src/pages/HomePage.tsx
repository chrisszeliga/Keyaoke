
export default function HomePage() {
  const handleLogin = () => {
    window.location.href = `/api/spotify/login`;
  };

  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <button className='bg-green-500 w-40 h-12 text-white rounded-lg' onClick={handleLogin}>
          Login with Spotify
        </button>
      </div>
    </>
  )
}
