import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import Main from './Components/Main';
import Dashboard from './Components/Dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
      <Routes>
        <Route path="/" exact element={<Main />}>
          <Route path='/' element={<Dashboard />} />
        </Route>
      </Routes>
  );
}

export default App;
