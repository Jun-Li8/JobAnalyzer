import './App.css'
import NavBar from './components/NavBar'
import {Routes,Route} from 'react-router-dom'
import Projects from './pages/Projects'
import About from './pages/About'
import Home from './pages/Home';


function App() {
  return (
    <>
    <div>
      <NavBar/>
      <Routes>
        <Route path='home' element={<Home/>}/>
        <Route path='projects' element={<Projects/>} />
        <Route path='about' element={<About/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
