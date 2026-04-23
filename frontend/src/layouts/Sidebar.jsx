import { useState } from "react";
import { Link } from "react-router-dom";
import AssessmentIcon from "@mui/icons-material/Assessment";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@mui/material";
import {  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  People as PeopleIcon,
  Category as CategoryIcon,           // Para Renglones
  MiscellaneousServices as ServicesIcon, // Para Servicios
  Person as PersonIcon,               // Para Personas
  Badge as BadgeIcon,                 // Para Empleados
  Description as DescriptionIcon,     // Para Contratos
  Assignment as AssignmentIcon,       // Para Permisos
  BeachAccess as BeachAccessIcon      // Para Vacaciones 
  } from "@mui/icons-material";

import GavelIcon from "@mui/icons-material/Gavel"

export default function Sidebar() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openRenglones, setOpenRenglones] = useState(false);
  const [openServicios, setOpenServicios] = useState(false);
  const [openEmpleados, setOpenEmpleados] = useState(false);
  const [openPersonas, setOpenPersonas] = useState(false);
  const [openContratos, setOpenContratos] = useState(false);
  const [openPermisos, setOpenPermisos] = useState(false);
  const [openVacaciones, setOpenVacaciones] = useState(false);
  const [openSanciones, setOpenSanciones] = useState(false);

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
        {/* Botón Home al inicio */}
        <ListItemButton component={Link} to="/dashboard/home">
          <ListItemIcon sx={{ color: "white" }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        {/* ================= USUARIOS ================= */}
        {user?.rol === "ADMIN" && (
          <>
            <ListItemButton onClick={() => setOpenUsuarios(!openUsuarios)}>
              <ListItemIcon sx={{ color: "white" }}><PeopleIcon /></ListItemIcon>
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

                {/* <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/usuarios/crear"
                >
                  <ListItemText primary="Crear Usuario" />
                </ListItemButton> */}

              </List>
            </Collapse>
          
          </>
        )}

        {/* ================= RENGLONES ================= */}
        {user?.rol === "ADMIN" && (
          <>
            <ListItemButton onClick={() => setOpenRenglones(!openRenglones)}>
               <ListItemIcon sx={{ color: "white" }}><CategoryIcon /></ListItemIcon>
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

                {/* <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/renglones/crear"
                >
                  <ListItemText primary="Crear Renglón" />
                </ListItemButton> */}

              </List>
            </Collapse>

          </>
        )}

        {/* ================= SERVICIOS ================= */}
        {user?.rol === "ADMIN" && (
          <>
            
            <ListItemButton onClick={() => setOpenServicios(!openServicios)}>
              <ListItemIcon sx={{ color: "white" }}><ServicesIcon /></ListItemIcon>
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
                {/* <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/dashboard/servicios/crear"
                >
                  <ListItemText primary="Crear Servicio" />
                </ListItemButton> */}
              </List>
            </Collapse>

          </>
        )}
        
        {/* ================= PERSONAS ================== */}
        <ListItemButton onClick={() => setOpenPersonas(!openPersonas)}>
          <ListItemIcon sx={{ color: "white" }}><PersonIcon /></ListItemIcon>
          <ListItemText primary="Personas" />
          {openPersonas ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openPersonas}>
          <List component="div" disablePadding>

            <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/personas">
              <ListItemText primary="Listar Personas" />
            </ListItemButton>

            {/* <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/personas/crear">
              <ListItemText primary="Crear Persona" />
            </ListItemButton> */}

          </List>
        </Collapse>

        {/* ================= EMPLEADOS ================= */}
        <ListItemButton onClick={() => setOpenEmpleados(!openEmpleados)}>
          <ListItemIcon sx={{ color: "white" }}><BadgeIcon /></ListItemIcon>
          <ListItemText primary="Empleados" />
          {openEmpleados ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openEmpleados} timeout="auto" unmountOnExit>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/empleados">
              <ListItemText primary="Listar Empleado" />
            </ListItemButton>

            {/* <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/empleados/crear">
              <ListItemText primary="Crear Empleado" />
            </ListItemButton> */}
        </Collapse>

                {/* ================= CONTRATOS ================= */}
        <ListItemButton onClick={() => setOpenContratos(!openContratos)}>
          <ListItemIcon sx={{ color: "white" }}><DescriptionIcon /></ListItemIcon>
          <ListItemText primary="Contratos" />
          {openContratos ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openContratos} timeout="auto" unmountOnExit>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/contratos">
            <ListItemText primary="Listar Contrato" />
          </ListItemButton>

          {/* <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/contratos/crear">
            <ListItemText primary="Crear Contrato" />
          </ListItemButton> */}
        </Collapse>
        {/* ================= PERMISOS ================= */}
        <ListItemButton onClick={() => setOpenPermisos(!openPermisos)}>
          <ListItemIcon sx={{ color: "white" }}><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Permisos" />
          {openPermisos ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPermisos} timeout="auto" unmountOnExit>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/permisos">
            <ListItemText primary="Listar Permisos" />
          </ListItemButton>
          {/* <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/permisos/crear">
            <ListItemText primary="Solicitar Permiso" />
          </ListItemButton> */}
          <ListItemButton component={Link} to="/dashboard/reportes/permisos">
  <ListItemIcon sx={{ color: "white" }}><AssessmentIcon /></ListItemIcon>
  <ListItemText primary="Reporte de Permisos" />
</ListItemButton>

          
        </Collapse>

        {/* Vacas */}
       <ListItemButton onClick={() => setOpenVacaciones(!openVacaciones)}>
        <ListItemIcon sx={{ color: "white" }}><BeachAccessIcon /></ListItemIcon>
        <ListItemText primary="Vacaciones" />
        {openVacaciones ? <ExpandLess /> : <ExpandMore />}
       </ListItemButton>
      <Collapse in={openVacaciones}>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/vacaciones">
            <ListItemText primary="Listar Solicitudes" />
          </ListItemButton>
          {/* <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/vacaciones/crear">
            <ListItemText primary="Solicitar Vacaciones" />
          </ListItemButton> */}
        </List>
      </Collapse>
        {/* =========================Sanciones============================ */}
        <ListItemButton onClick={() => setOpenSanciones(!openSanciones)}>
          <ListItemIcon sx={{ color: "white" }}><GavelIcon /></ListItemIcon>
          <ListItemText primary="Sanciones" />
          {openSanciones ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSanciones}>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/sanciones">
              <ListItemText primary="Listar Sanciones" />
            </ListItemButton>
            {/* <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/sanciones/crear">
              <ListItemText primary="Registrar Sanción" />
            </ListItemButton> */}
          </List>
        </Collapse>
      </List>
    </Box>
  );
}