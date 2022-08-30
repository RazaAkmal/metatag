import React from 'react'
import App from './App'
import Profile from './Profile'
import AirDrop from './AirDrop'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

const PageRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route
            path="/"
            element={<App />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/airdrop"
            element={<AirDrop />}
          />
        </Route>
        <Route exact path='/login' element={<Login />} />
        {/* <Route exact path="/" element={<App/>}/>
            <Route exact path="/airdrop" element={<AirDrop/>}/> */}
        {/* <Route path="*" element={<NotFound/>}/> */}
      </Routes>
    </Router>
  )
}

export default PageRoutes