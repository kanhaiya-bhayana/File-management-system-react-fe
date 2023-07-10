import React from 'react'
import styles from './Dashboard.module.css'
import Form from './Form'
export default function Dashboard() {
  return (
    <div className={styles.main}>
      <h1>Dashboard</h1>
      <Form />
    </div>
  )
}
