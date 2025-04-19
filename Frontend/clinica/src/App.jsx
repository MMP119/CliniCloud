import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppointmentForm from './Features/client/AppointmentForm'
import './App.css'
import MainLayout from './Layouts/MainLayout'
import Home from './Pages/Home'
import Login from './Components/Login'

function App() {
  return(
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/agendar-cita" element={<AppointmentForm />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
