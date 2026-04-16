// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Layout from "./layouts/Layout";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard" element={<Layout/>} />
//           <Route path="usuarios" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./layouts/Layout";
import PrivateRoute from "./components/PrivateRoute";
import CrearEmpleado from "./pages/empleados/crear";
import EmpleadosList from "./pages/empleados/listar";
import CrearUsuario from "./pages/Usuarios";
import CrearRenglon from "./pages/renglones/crear";
import ListarRenglones from "./pages/renglones/listar";
import CrearServicio from "./pages/servicios/crear";
import ListarServicio from "./pages/servicios/listar"
import CrearPersona from "./pages/personas/crear";
import ListarPersonas from "./pages/personas/listar";
import ListarEmpleados from "./pages/empleados/listar";
import ListarContratos from "./pages/contratos/listar";
import CrearContrato from "./pages/contratos/crear";
import CrearPermiso from "./pages/permisos/crear";
import ListarPermiso from "./pages/permisos/listar";
import DetallePermiso from "./pages/permisos/detalle";
import CrearVacacion from "./pages/vacaciones/crear";
import ListarVacaciones from "./pages/vacaciones/listar";
import DetalleVacacion from "./pages/vacaciones/detalle";
import Home from "./pages/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Layout con sidebar */}
        <Route path="/dashboard" element={<PrivateRoute>
          <Layout /> 
        </PrivateRoute>}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path="usuarios" element={<Dashboard />} />
          <Route path="usuarios/crear" element={<CrearUsuario />} />
          <Route path="empleados" element={<ListarEmpleados />} />
          <Route path="empleados/crear" element={<CrearEmpleado />} />
          <Route path="renglones" element={<ListarRenglones />} />
          <Route path="renglones/crear" element={<CrearRenglon />} />
          <Route path="servicios" element={<ListarServicio />} />
          <Route path="servicios/crear" element={<CrearServicio />} />
          <Route path="personas" element={<ListarPersonas />} />
          <Route path="personas/crear" element={<CrearPersona />} />
          <Route path="contratos" element={<ListarContratos />} />
          <Route path="contratos/crear" element={<CrearContrato />} />
          <Route path="permisos" element={<ListarPermiso />} />
          <Route path="permisos/crear" element={<CrearPermiso />} />
          <Route path="permisos/:id" element={<DetallePermiso />} />
          <Route path="vacaciones" element={<ListarVacaciones />} />
          <Route path="vacaciones/crear" element={<CrearVacacion />} />
          <Route path="vacaciones/:id" element={<DetalleVacacion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;