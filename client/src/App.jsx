import './App.css'
import { Route, Routes } from 'react-router-dom'
import VehicleCreatePage from './pages/VehicleCreatePage'
import VehicleEditPage from './pages/VehicleEditPage'
import VehicleListPage from './pages/VehicleListPage'

export default function App() {
  return (
    <div className="app-shell">
      <main className="page-container">
        <Routes>
          <Route path='/' element={<VehicleListPage />} />
          <Route path='/vehicles' element={<VehicleListPage />} />
          <Route path='/vehicles/new' element={<VehicleCreatePage />} />
          <Route path='/vehicles/:id/edit' element={<VehicleEditPage />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </div>
  )
}
