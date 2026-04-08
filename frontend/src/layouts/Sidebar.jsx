import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Collapse
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function Sidebar() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openRenglones, setOpenRenglones] = useState(false);
  const [openServicios, setOpenServicios] = useState(false);
  const [openEmpleados, setOpenEmpleados] = useState(false);
  const [openPersonas, setOpenPersonas] = useState(false);
  const [openContratos, setOpenContratos] = useState(false);

  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: "#111827",
        color: "white",
        p: 2,
        height: "100vh"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        RRHH Panel
      </Typography>

      <List component="nav">

        {/* ================= USUARIOS ================= */}
        {user?.rol === "ADMIN" && (
          <>
            <ListItemButton onClick={() => setOpenUsuarios(!openUsuarios)}>
              <ListItemText primary="Usuarios" />
              {openUsuarios ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openUsuarios} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>

                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/usuarios"
                >
                  <ListItemText primary="Listar Usuarios" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/usuarios/crear"
                >
                  <ListItemText primary="Crear Usuario" />
                </ListItemButton>

              </List>
            </Collapse>

            <Divider sx={{ my: 2, backgroundColor: "gray" }} />
          </>
        )}

        {/* ================= RENGLONES ================= */}
        {user?.rol === "ADMIN" && (
          <>
            <ListItemButton onClick={() => setOpenRenglones(!openRenglones)}>
              <ListItemText primary="Renglones" />
              {openRenglones ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openRenglones} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>

                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/renglones"
                >
                  <ListItemText primary="Listar Renglones" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/renglones/crear"
                >
                  <ListItemText primary="Crear Renglón" />
                </ListItemButton>

              </List>
            </Collapse>

            <Divider sx={{ my: 2, backgroundColor: "gray" }} />
          </>
        )}

        {/* ================= SERVICIOS ================= */}
        {user?.rol === "ADMIN" && (
          <>
            
            <ListItemButton onClick={() => setOpenServicios(!openServicios)}>
              <ListItemText primary="Servicios" />
              {openServicios ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openServicios} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/servicios"
                >
                  <ListItemText primary="Listar Servicios" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/servicios/crear"
                >
                  <ListItemText primary="Crear Servicio" />
                </ListItemButton>
              </List>
            </Collapse>

            <Divider sx={{ my: 2, backgroundColor: "gray" }} />
          </>
        )}
        
        {/* ================= PERSONAS ================== */}
        <ListItemButton onClick={() => setOpenPersonas(!openPersonas)}>
          <ListItemText primary="Personas" />
          {openPersonas ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openPersonas}>
          <List component="div" disablePadding>

            <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/personas">
              <ListItemText primary="Listar Personas" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/personas/crear">
              <ListItemText primary="Crear Persona" />
            </ListItemButton>

          </List>
        </Collapse>

        {/* ================= EMPLEADOS ================= */}
        <ListItemButton onClick={() => setOpenEmpleados(!openEmpleados)}>
          <ListItemText primary="Empleados" />
          {openEmpleados ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openEmpleados} timeout="auto" unmountOnExit>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/empleados">
              <ListItemText primary="Listar Empleado" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/empleados/crear">
              <ListItemText primary="Crear Empleado" />
            </ListItemButton>
        </Collapse>

                {/* ================= CONTRATOS ================= */}
        <ListItemButton onClick={() => setOpenContratos(!openContratos)}>
          <ListItemText primary="Contratos" />
          {openContratos ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openContratos} timeout="auto" unmountOnExit>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/contratos">
            <ListItemText primary="Listar Contrato" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/contratos/crear">
            <ListItemText primary="Crear Contrato" />
          </ListItemButton>
        </Collapse>

      </List>
    </Box>
  );
}