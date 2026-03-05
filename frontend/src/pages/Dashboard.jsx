// import { useState, useEffect } from "react";
// import {
//   Typography,
//   Container,
//   Box,
//   Button,
//   Alert,
//   IconButton,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("access");

//   if (!user || user.rol !== "ADMIN") {
//     return <h3>No tiene permisos para acceder</h3>;
//   }

//   const [usuarios, setUsuarios] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [mensaje, setMensaje] = useState(null);

//   const [openModal, setOpenModal] = useState(false);
//   const [editandoId, setEditandoId] = useState(null);

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [rol, setRol] = useState("");

//   useEffect(() => {
//     cargarUsuarios();
//     cargarRoles();
//   }, []);

//   const cargarUsuarios = async () => {
//     const res = await axios.get("http://127.0.0.1:8000/api/usuarios/", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUsuarios(res.data);
//   };

//   const cargarRoles = async () => {
//     const res = await axios.get("http://127.0.0.1:8000/api/roles/", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setRoles(res.data);
//   };

//   const abrirCrear = () => {
//     setEditandoId(null);
//     setUsername("");
//     setPassword("");
//     setRol("");
//     setOpenModal(true);
//   };

//   const abrirEditar = (usuario) => {
//     setEditandoId(usuario.id);
//     setUsername(usuario.username);
//     setRol(usuario.id_rol);
//     setOpenModal(true);
//   };

//   const handleGuardar = async () => {
//     try {
//       if (editandoId) {
//         await axios.put(
//           `http://127.0.0.1:8000/api/usuarios/${editandoId}/`,
//           {
//             username,
//             id_rol: rol,
//             activo: true,
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setMensaje("Usuario actualizado correctamente ✅");
//       } else {
//         await axios.post(
//           "http://127.0.0.1:8000/api/usuarios/",
//           {
//             username,
//             password,
//             id_rol: rol,
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setMensaje("Usuario creado correctamente ✅");
//       }

//       setOpenModal(false);
//       cargarUsuarios();
//     } catch (error) {
//       setMensaje("Error al guardar usuario ❌");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <Container>
//       <Box sx={{ mt: 5 }}>
//         <Typography variant="h4" gutterBottom>
//           Panel de Administración 👨‍💼
//         </Typography>

//         {mensaje && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             {mensaje}
//           </Alert>
//         )}

//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//           <Typography variant="h6">Usuarios</Typography>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={abrirCrear}
//           >
//             Crear Usuario
//           </Button>
//         </Box>

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Username</TableCell>
//               <TableCell>Rol</TableCell>
//               <TableCell>Activo</TableCell>
//               <TableCell>Acciones</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {usuarios.map((u) => (
//               <TableRow key={u.id}>
//                 <TableCell>{u.id}</TableCell>
//                 <TableCell>{u.username}</TableCell>
//                 <TableCell>{u.rol_nombre}</TableCell>
//                 <TableCell>{u.activo ? "Sí" : "No"}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => abrirEditar(u)}>
//                     <EditIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         <Button
//           variant="outlined"
//           color="error"
//           sx={{ mt: 4 }}
//           onClick={handleLogout}
//         >
//           Cerrar Sesión
//         </Button>
//       </Box>

//       {/* 🔹 MODAL */}
//       <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
//         <DialogTitle>
//           {editandoId ? "Editar Usuario" : "Crear Usuario"}
//         </DialogTitle>

//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Username"
//             sx={{ mt: 2 }}
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           {!editandoId && (
//             <TextField
//               fullWidth
//               type="password"
//               label="Password"
//               sx={{ mt: 2 }}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           )}

//           <TextField
//             select
//             fullWidth
//             label="Rol"
//             sx={{ mt: 2 }}
//             value={rol}
//             onChange={(e) => setRol(e.target.value)}
//           >
//             {roles.map((r) => (
//               <MenuItem key={r.id} value={r.id}>
//                 {r.nombre}
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
//           <Button variant="contained" onClick={handleGuardar}>
//             Guardar
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import axios from "axios";

export default function Dashboard() {

  const token = localStorage.getItem("access");

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
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/usuarios/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarRoles = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/roles/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRoles(res.data);
    } catch (error) {
      console.error(error);
    }
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
    setPassword("");
    setOpenModal(true);
  };

  const eliminarUsuario = async (id) => {

    if (!window.confirm("¿Eliminar usuario?")) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/api/usuarios/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("Usuario eliminado");

      cargarUsuarios();

    } catch {
      setMensaje("Error eliminando usuario");
    }
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

        setMensaje("Usuario actualizado");

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

        setMensaje("Usuario creado");
      }

      setOpenModal(false);
      cargarUsuarios();

    } catch (error) {
      console.error(error);
      setMensaje("Error guardando usuario");
    }
  };

  const columnas = [

    { field: "id", headerName: "ID", width: 90 },

    { field: "username", headerName: "Usuario", flex: 1 },

    { field: "rol_nombre", headerName: "Rol", flex: 1 },

    {
      field: "activo",
      headerName: "Activo",
      width: 120,
      renderCell: (params) => (params.row.activo ? "Sí" : "No"),
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => abrirEditar(params.row)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => eliminarUsuario(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (

    <Box>

      <Typography variant="h4" gutterBottom>
        Administración de Usuarios
      </Typography>

      {mensaje && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={abrirCrear}
        >
          Crear Usuario
        </Button>
      </Box>

      <div style={{ height: 500, width: "100%" }}>

        <DataGrid
          rows={usuarios}
          columns={columnas}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          disableRowSelectionOnClick
        />

      </div>

      {/* MODAL */}

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

          <Button onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>

          <Button variant="contained" onClick={handleGuardar}>
            Guardar
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}