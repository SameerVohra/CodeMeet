import { Outlet } from 'react-router'
import './App.css'
function App() {  
  return (
    <>
      <div className='min-h-dvh bg-gradient-to-br from-black via-gray-500 to-gray-300'>
        <Outlet/>
      </div>
  </>
  )
}

export default App
