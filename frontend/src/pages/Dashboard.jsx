// import { useState, useEffect } from "react";
// import {
//   Typography,
//   Container,
//   Box,
//   TextField,
//   Button,
//   MenuItem,
//   Alert,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("access");

//   if (!user || user.rol !== "ADMIN") {
//     return <h3>No tiene permisos para acceder</h3>;
//   }

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [rol, setRol] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [usuarios, setUsuarios] = useState([]);
//   const [mensaje, setMensaje] = useState(null);
//   const [editandoId, setEditandoId] = useState(null);

//   useEffect(() => {
//     cargarRoles();
//     cargarUsuarios();
//   }, []);

//   const cargarRoles = async () => {
//     const res = await axios.get("http://127.0.0.1:8000/api/roles/", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setRoles(res.data);
//   };

//   const cargarUsuarios = async () => {
//     const res = await axios.get("http://127.0.0.1:8000/api/usuarios/", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUsuarios(res.data);
//   };

//   const limpiarFormulario = () => {
//     setUsername("");
//     setPassword("");
//     setRol("");
//     setEditandoId(null);
//   };

//   const handleGuardar = async () => {
//     try {
//       if (editandoId) {
//         // 🔵 EDITAR
//         await axios.put(
//           `http://127.0.0.1:8000/api/usuarios/${editandoId}/`,
//           {
//             username,
//             id_rol: rol,
//             activo: true,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setMensaje("Usuario actualizado correctamente ✅");
//       } else {
//         // 🟢 CREAR
//         await axios.post(
//           "http://127.0.0.1:8000/api/usuarios/",
//           {
//             username,
//             password,
//             id_rol: rol,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setMensaje("Usuario creado correctamente ✅");
//       }

//       limpiarFormulario();
//       cargarUsuarios();
//     } catch (error) {
//       setMensaje("Error al guardar usuario ❌");
//     }
//   };

//   const handleEditar = (usuario) => {
//     setUsername(usuario.username);
//     setRol(usuario.id_rol);
//     setEditandoId(usuario.id);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <Container>
//       <Box sx={{ mt: 5, p: 4, borderRadius: 3, boxShadow: 3 }}>
//         <Typography variant="h4" gutterBottom>
//           Panel de Administración 👨‍💼
//         </Typography>

//         {mensaje && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             {mensaje}
//           </Alert>
//         )}

//         <TextField
//           fullWidth
//           label="Username"
//           sx={{ mb: 2 }}
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         {!editandoId && (
//           <TextField
//             fullWidth
//             label="Password"
//             type="password"
//             sx={{ mb: 2 }}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         )}

//         <TextField
//           select
//           fullWidth
//           label="Rol"
//           sx={{ mb: 3 }}
//           value={rol}
//           onChange={(e) => setRol(e.target.value)}
//         >
//           {roles.map((r) => (
//             <MenuItem key={r.id} value={r.id}>
//               {r.nombre}
//             </MenuItem>
//           ))}
//         </TextField>

//         <Button
//           variant="contained"
//           fullWidth
//           onClick={handleGuardar}
//           sx={{ mb: 2 }}
//         >
//           {editandoId ? "Actualizar Usuario" : "Crear Usuario"}
//         </Button>

//         {editandoId && (
//           <Button
//             variant="outlined"
//             fullWidth
//             onClick={limpiarFormulario}
//             sx={{ mb: 2 }}
//           >
//             Cancelar edición
//           </Button>
//         )}

//         <Divider sx={{ my: 4 }} />

//         <Typography variant="h5">Usuarios Registrados</Typography>

//         <List>
//           {usuarios.map((u) => (
//             <ListItem
//               key={u.id}
//               secondaryAction={
//                 <IconButton onClick={() => handleEditar(u)}>
//                   <EditIcon />
//                 </IconButton>
//               }
//               divider
//             >
//               <ListItemText
//                 primary={u.username}
//                 secondary={`Rol: ${u.rol_nombre || u.id_rol}`}
//               />
//             </ListItem>
//           ))}
//         </List>

//         <Button
//           variant="outlined"
//           color="error"
//           fullWidth
//           sx={{ mt: 3 }}
//           onClick={handleLogout}
//         >
//           Cerrar Sesión
//         </Button>
//       </Box>
//     </Container>
//   );
// }
import { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  Alert,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access");

  if (!user || user.rol !== "ADMIN") {
    return <h3>No tiene permisos para acceder</h3>;
  }

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/usuarios/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsuarios(res.data);
  };

  const cargarRoles = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/roles/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRoles(res.data);
  };

  const abrirCrear = () => {
    setEditandoId(null);
    setUsername("");
    setPassword("");
    setRol("");
    setOpenModal(true);
  };

  const abrirEditar = (usuario) => {
    setEditandoId(usuario.id);
    setUsername(usuario.username);
    setRol(usuario.id_rol);
    setOpenModal(true);
  };

  const handleGuardar = async () => {
    try {
      if (editandoId) {
        await axios.put(
          `http://127.0.0.1:8000/api/usuarios/${editandoId}/`,
          {
            username,
            id_rol: rol,
            activo: true,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMensaje("Usuario actualizado correctamente ✅");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/usuarios/",
          {
            username,
            password,
            id_rol: rol,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMensaje("Usuario creado correctamente ✅");
      }

      setOpenModal(false);
      cargarUsuarios();
    } catch (error) {
      setMensaje("Error al guardar usuario ❌");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Administración 👨‍💼
        </Typography>

        {mensaje && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {mensaje}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Usuarios</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirCrear}
          >
            Crear Usuario
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.rol_nombre}</TableCell>
                <TableCell>{u.activo ? "Sí" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => abrirEditar(u)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 4 }}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </Box>

      {/* 🔹 MODAL */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>
          {editandoId ? "Editar Usuario" : "Crear Usuario"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            sx={{ mt: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {!editandoId && (
            <TextField
              fullWidth
              type="password"
              label="Password"
              sx={{ mt: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <TextField
            select
            fullWidth
            label="Rol"
            sx={{ mt: 2 }}
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.nombre}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}