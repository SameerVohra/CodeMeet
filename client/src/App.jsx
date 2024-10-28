import { Outlet } from 'react-router'
import './App.css'
function App() {  
  return (
    <>
      <div className='min-h-dvh '>
        <Outlet/>
      </div>
  </>
  )
}

export default App
