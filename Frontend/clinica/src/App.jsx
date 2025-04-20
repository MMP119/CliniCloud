import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppointmentForm from './Features/client/AppointmentForm'
import './App.css'
import MainLayout from './Layouts/MainLayout'
import Home from './Pages/Home'
import Login from './Components/Login'
import DoctorLayout from "./Layouts/DoctorLayout";
import LabLayout from "./Layouts/LabLayout";
import DoctorDashboard from "./Pages/Doctor/DashboardDoctor";
import LabDashboard from "./Pages/Laboratorio/DashboardLab";
import CitasDoctor from "./Pages/Doctor/Citas";

function App() {
  return(
    <Router>
      <Routes>
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/agendar-cita" element={<AppointmentForm />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/dashboard/doctor" element={<DoctorLayout />}> 
          <Route index element={<DoctorDashboard />} />
          <Route path="citas" element={<CitasDoctor />} />
        </Route>

        <Route path="/dashboard/lab" element={<LabLayout />}> 
          <Route index element={<LabDashboard />} />
        </Route>

        
      </Routes>
    </Router>
  )
}

export default App
