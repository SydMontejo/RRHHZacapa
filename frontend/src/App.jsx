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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Layout con sidebar */}
        <Route path="/dashboard" element={<PrivateRoute>
          <Layout /> 
        </PrivateRoute>}>
          <Route index element={<Navigate to="usuarios" />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;