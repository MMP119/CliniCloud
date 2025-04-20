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
import CalendarioDoctor from "./Pages/Doctor/Calendario";
import CitasListaDoctor from "./Pages/Doctor/Citas";
import ResultadosDoctor from "./Pages/Doctor/Resultados";
import DespensaDoctor from "./Pages/Doctor/Despensa";

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
          <Route path="calendario" element={<CalendarioDoctor />} />
          <Route path="citas" element={<CitasListaDoctor />} />
          <Route path="resultados" element={<ResultadosDoctor />} />
          <Route path="despensa" element={<DespensaDoctor />} />
        </Route>

        <Route path="/dashboard/lab" element={<LabLayout />}> 
          <Route index element={<LabDashboard />} />
        </Route>

        
      </Routes>
    </Router>
  )
}

export default App
