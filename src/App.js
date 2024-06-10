import React, { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './components/dashboard';
import Companies from './components/companies';
import Header from './components/header';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import Users from './components/users';
import Notes from './components/notes';
import SignInUp from './components/signin_up';
import Calendar from './components/calander';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faStickyNote, 
  faBuilding,
  faChartBar, 
  faUser
} from '@fortawesome/free-regular-svg-icons';
import Toast from './components/toast';


function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [token,setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [isLogin,setIsLogin])
  

  return (
    <div className="App">
      <Toast/>
      {token ? (
        <>
          <Header isLogin={isLogin} setIsLogin={setIsLogin}/>
          <Router>
            <div className="app-container">
              <Sidebar className="sidebar text-left">
                <Menu>
                  <Link to="/" className='menu-item'>
                    <MenuItem className='menu-item-container mt-4'>
                      <FontAwesomeIcon icon={faChartBar} className="mr-3" />
                      Dashboard
                    </MenuItem>
                  </Link>
                  <Link to="/calendar" className='menu-item'>
                    <MenuItem className='menu-item-container'>
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
                      Calendar
                    </MenuItem>
                  </Link>
                  <Link to="/users" className='menu-item'>
                    <MenuItem className='menu-item-container'>
                      <FontAwesomeIcon icon={faUser} className="mr-3" />
                      Users
                    </MenuItem>
                  </Link>
                  <Link to="/notes" className='menu-item'>
                    <MenuItem className='menu-item-container'>
                      <FontAwesomeIcon icon={faStickyNote} className="mr-3" />
                      Notes
                    </MenuItem>
                  </Link>
                  <Link to="/companies" className='menu-item'>
                    <MenuItem className='menu-item-container'>
                      <FontAwesomeIcon icon={faBuilding} className="mr-3" />
                      Companies
                    </MenuItem>
                  </Link>
                </Menu>
              </Sidebar>

              <div className="content">
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/calendar' element={<Calendar />} />
                  <Route path='/users' element={<Users />} />
                  <Route path='/notes' element={<Notes />} />
                  <Route path='/companies' element={<Companies />} />
                  <Route path='/login' element={<SignInUp />} />
                </Routes>
              </div>
            </div>
          </Router>
        </>
      ) : (
        <SignInUp setIsLogin={setIsLogin} isLogin={isLogin} />
      )}
    </div>
  );
}

export default App;
