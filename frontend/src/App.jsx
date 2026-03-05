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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;