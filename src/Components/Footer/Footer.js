import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer class="bg-light text-center text-lg-start">
  <div className={"text-center p-3" + " "+ styles.mainSection}>
    <p className={styles.fontWeight}>© 2023 Copyright: &nbsp; FMS</p>
    
  </div>
</footer>
  )
}
