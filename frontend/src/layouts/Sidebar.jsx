// import { Link } from "react-router-dom";
// import { Box, Button, Typography } from "@mui/material";

// export default function Sidebar() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   return (
//     <Box
//       sx={{
//         width: 250,
//         backgroundColor: "#111827",
//         color: "white",
//         p: 3,
//       }}
//     >
//       <Typography variant="h6">RRHH Panel</Typography>
      
//       <Typography variant="h5">USUARIOS</Typography>
//       {/* USUARIOS */}

//       <Button
//         fullWidth
//         variant="contained"
//         sx={{ mt: 2 }}
//         component={Link}
//         to="/dashboard/usuarios"
//       >
//         Listar Usuarios
//       </Button>

//       <Button
//         fullWidth
//         variant="outlined"
//         sx={{ mt: 2, color: "white", borderColor: "white" }}
//         component={Link}
//         to="/dashboard/usuarios/crear"
//       >
//         Crear Usuario
//       </Button>

      
//       {/* EMPLEADOS */}
//       <Typography variant="h5">Empleados</Typography>
//       <Button
//         fullWidth
//         variant="contained"
//         sx={{ mt: 4 }}
//         component={Link}
//         to="/dashboard/empleados"
//       >
//         Listar Empleados
//       </Button>

//       <Button
//         fullWidth
//         variant="outlined"
//         sx={{ mt: 2, color: "white", borderColor: "white" }}
//         component={Link}
//         to="/dashboard/empleados/crear"
//       >
//         Crear Empleado
//       </Button>

//     </Box>
//   );
// }
import { Link } from "react-router-dom";
import { Box, Button, Typography, Divider } from "@mui/material";

export default function Sidebar() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: "#111827",
        color: "white",
        p: 3,
      }}
    >
      <Typography variant="h6">RRHH Panel</Typography>

      {/* BOTONES SOLO ADMIN */}

      {user?.rol === "ADMIN" && (
        <>
          <Typography sx={{ mt: 3 }}>Usuarios</Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            component={Link}
            to="/dashboard/usuarios"
          >
            Listar Usuarios
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2, color: "white", borderColor: "white" }}
            component={Link}
            to="/dashboard/usuarios/crear"
          >
            Crear Usuario
          </Button>

          <Divider sx={{ mt: 3, mb: 2, backgroundColor: "gray" }} />
        </>
      )}

      {/* BOTONES PARA TODOS */}

      <Typography>Empleados</Typography>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        component={Link}
        to="/dashboard/empleados"
      >
        Listar Empleados
      </Button>

      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 2, color: "white", borderColor: "white" }}
        component={Link}
        to="/dashboard/empleados/crear"
      >
        Crear Empleado
      </Button>

    </Box>
  );
}