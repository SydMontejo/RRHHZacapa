import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../PrivateRoute";
import ListarRenglones from "../pages/renglones/listar";
import CrearRenglon from "../pages/renglones/crear"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
        
        <Route 
          path="/dashboard/renglones" 
          element={
            <ListarRenglones />} 
        />
        
        <Route 
          path="/dashboard/renglones/crear" 
          element={
            <CrearRenglon />} 
        />

        <Route 
          path="/dashboard/servicios" 
          element={
            <ListarRenglones />} 
        />
        
        <Route 
          path="/dashboard/servicios/crear" 
          element={
            <CrearRenglon />} 
        />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

