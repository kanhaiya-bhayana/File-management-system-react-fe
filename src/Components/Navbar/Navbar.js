import React from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={"navbar navbar-expand-lg" + " " + styles.navbarMainSection} >
      <a className="navbar-brand text-light" style={{"margin-left":"20px"}} href="#">FMS</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link text-light" href="#">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" href="#">Features</a>
          </li>
          
        </ul>
      </div>
    </nav>
  )
}
