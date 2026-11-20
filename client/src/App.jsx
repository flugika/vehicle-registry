import './App.css'
import { Route, Routes } from 'react-router-dom'
import VehicleCreatePage from './pages/VehicleCreatePage'
import VehicleEditPage from './pages/VehicleEditPage'
import VehicleListPage from './pages/VehicleListPage'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<VehicleListPage />}></Route>
      <Route path='/vehicles' element={<VehicleListPage />}></Route>
      <Route path='/vehicles/new' element={<VehicleCreatePage />}></Route>
      <Route path='/vehicles/:id/edit' element={<VehicleEditPage />}></Route>
      <Route path="*" element={<p>Page not found</p>} />
    </Routes>
  )
}
