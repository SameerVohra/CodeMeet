import { useEffect } from 'react'
import './App.css'
import { io } from 'socket.io-client'
function App() {
  const socket = io('http://localhost:3000')
  useEffect(()=>{
    socket.on('message', (data)=>{
      console.log(data );
    })

    return () => {
      socket.off("message");
      socket.disconnect();
    }
  }, [])
  return (
    <>
      <div className='bg-black min-h-dvh'>
        <h1 className='text-red-500 text-2xl'>Hello world</h1>
      </div>
    </>
  )
}

export default App
