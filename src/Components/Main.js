import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

export default function Main() {
  return (
    <div className='text-center'>
    <Navbar />
    <Outlet />
    <Footer />
    </div>
  )
}
