// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import { Box, Button } from "@mui/material";

// export default function Layout() {
//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <Sidebar />

//       <div style={{ flex: 1, padding: "20px" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Box, Button } from "@mui/material";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // si usas token
    navigate("/", { replace: true});
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box sx={{ flex: 1, position: "relative", p: 3 }}>

        {/* BOTÓN CERRAR SESIÓN */}
        <Button
          variant="text"
          color="error"
          onClick={handleLogout}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            fontWeight: "bold",
          }}
        >
          Log Out
        </Button>

        <Outlet />
      </Box>
    </div>
  );
}