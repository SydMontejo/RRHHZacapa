import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: "#111827",
        color: "white",
        p: 3,
      }}
    >
      <h2>RRHH Panel</h2>

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
    </Box>
  );
}

