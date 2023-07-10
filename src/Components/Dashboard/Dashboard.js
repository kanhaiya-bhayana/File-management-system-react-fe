import React from 'react'
import styles from './Dashboard.module.css'
import Form from './Form'
export default function Dashboard() {
  return (
    <div className={styles.main}>
      <h2>Dashboard</h2>
      <Form />
    </div>
  )
}
