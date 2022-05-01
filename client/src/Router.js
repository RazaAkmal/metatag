import React from 'react'
import App from './App'
import AirDrop from './AirDrop'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";

const PageRoutes = () => {
  return (
        <Router>
          <Routes>
            <Route exact path="/" element={<App/>}/>
            <Route exact path="/airdrop" element={<AirDrop/>}/>
            {/* <Route path="*" element={<NotFound/>}/> */}
          </Routes>
      </Router>
  )
}

export default PageRoutes