import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Main() {
  return (
    <div className='text-center'>
    <h1>Navbar</h1>
    <Outlet />
    <h1>Footer</h1>
    </div>
  )
}
