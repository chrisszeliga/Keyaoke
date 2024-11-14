import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import UpgradePage from './pages/UpgradePage'
import PlayPage from './pages/PlayPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upgrade" element={<UpgradePage />}/>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/play" element={<PlayPage />} />
      </Routes>
    </Router>
  );
}

export default App;
