import './App.css'
import NavBar from './components/NavBar'
import {Routes,Route} from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home';
import {Analysis,AnalysisDetails} from './pages/Analysis'


function App() {
  return (
    <>
    <div>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='home' element={<Home/>}/>
        <Route path='analysis' element={<Analysis/>} />
        <Route path='analysis/:id' element={<AnalysisDetails/>} />
        <Route path='about' element={<About/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
