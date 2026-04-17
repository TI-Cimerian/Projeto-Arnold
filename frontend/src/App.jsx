import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Catalog from './pages/Catalog'
import Lista_Pedidos from './pages/Lista_Pedidos'
import Pedido from './pages/Pedido'
import { AppLayout } from './components/layout/AppLayout'
import Maquina from './pages/Maquina'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-body overflow-x-hidden">
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Catalog />} />
          <Route path="/pedidos" element={<Lista_Pedidos />} />
          <Route path="/pedidos/:id" element={<Pedido />} />
          <Route path="/maquina/:id" element={<Maquina />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
