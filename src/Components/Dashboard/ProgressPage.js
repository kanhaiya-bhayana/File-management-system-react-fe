import React from 'react'
import loadingImage from '../../images/loading.gif';
import styles from './Progress.module.css'

export default function ProgressPage() {
  return (
    <div className='container'>
        <div className='row'>
            <h2 className={styles.loadingTitle}>
                Loading...
            </h2>
        </div>
            <br />
            <img src={loadingImage} alt='loading' />

    </div>
  )
}
