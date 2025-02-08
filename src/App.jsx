import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Welcome from './components/Welcome'
import Loginuser from './components/auth/user/Loginuser'
import Signupuser from './components/auth/user/Signupuser'
import Loginshopowner from './components/auth/shopowner/Loginshopowner'
import Signupshopowner from './components/auth/shopowner/Signupshopowner'
import Dashboarduser from './components/dashboard/user/Dashboarduser'
import Dashboardshopowner from './components/dashboard/shopowner/Dashboardshopowner'
import Upload from './components/Upload'
import Status from './components/Status'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/user/login" element={<Loginuser/>}/>
        <Route path="/user/signup" element={<Signupuser/>}/>
        <Route path="/shopowner/login" element={<Loginshopowner/>}/>
        <Route path="/shopowner/signup" element={<Signupshopowner/>}/>
        <Route path="/user/dashboard" element={<Dashboarduser/>}/>
        <Route path="/shopowner/dashboard" element={<Dashboardshopowner/>}/>
        <Route path="/user/upload" element={<Upload/>}/> 
        <Route path="/user/status" element={<Status/>}/>
      </Routes>
      </Router>
  )
}

export default App
