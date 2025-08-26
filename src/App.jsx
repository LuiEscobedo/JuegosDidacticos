import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Inicio  from '../src/pages/Inicio'
import Memorama from '../src/pages/Memorama'
function App() {
  
  return (
    <>
      <div className='w-full h-full flex justify-center'>
        <Memorama/>
      </div>
    </>
  )
}

export default App
