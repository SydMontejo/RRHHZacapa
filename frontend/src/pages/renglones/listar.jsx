// import { useEffect, useState } from "react";
// import { Box, Typography, Alert, CircularProgress } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";

// export default function ListarRenglones() {
//   const [renglones, setRenglones] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("access");

//   const obtenerRenglones = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/renglones/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRenglones(res.data);
//     } catch (error) {
//       console.error(error);
//       if (error.response?.status === 401) {
//         setError("No autorizado. Verifica tu sesión.");
//       } else {
//         setError("Error al cargar los renglones.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     obtenerRenglones();
//   }, []);

//   const columnas = [
//     { field: "id_renglon", headerName: "ID", width: 90 },
//     { field: "codigo", headerName: "Código", width: 120 },
//     { field: "descripcion", headerName: "Descripción", width: 250 },
//     { field: "tipo_presupuestario", headerName: "Tipo", width: 200 },
//     {
//       field: "activo",
//       headerName: "Activo",
//       width: 120,
//       renderCell: (params) => (params.value ? "Sí" : "No"),
//     },
//   ];

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" mb={2}>
//         Renglones
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <div style={{ height: 500, width: "100%" }}>
//         <DataGrid
//           rows={renglones}
//           columns={columnas}
//           getRowId={(row) => row.id_renglon}
//           pageSizeOptions={[5, 10, 20]}
//           initialState={{
//             pagination: { paginationModel: { pageSize: 5 } },
//           }}
//         />
//       </div>
//     </Box>
//   );
// }

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
//import api from "../../api/axios";
import axios from "axios"
import { Link } from "react-router-dom";

export default function ListarRenglones() {

  const [renglones, setRenglones] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [renglonEdit, setRenglonEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ================= OBTENER =================
  const obtenerRenglones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/renglones/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRenglones(res.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setError("No autorizado. Verifica tu sesión.");
      } else {
        setError("Error al cargar los renglones.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerRenglones();
  }, []);

  // ================= SNACKBAR =================
  const mostrarMensaje = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ================= EDITAR =================
  const abrirModal = (row) => {
    setRenglonEdit(row);
    setOpenModal(true);
  };

  const handleChange = (e) => {
    setRenglonEdit({
      ...renglonEdit,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = async () => {
  try {
    await axios.put(
      `http://127.0.0.1:8000/api/renglones/${renglonEdit.id_renglon}/`,
      renglonEdit,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    mostrarMensaje("Renglón actualizado");
    setOpenModal(false);
    obtenerRenglones();
  } catch (error) {
    mostrarMensaje("Error al actualizar", "error");
  }
};

  // ================= ELIMINAR =================
  const eliminarRenglon = async (id) => {
  const confirmacion = window.confirm("¿Eliminar este renglón?");
  if (!confirmacion) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/api/renglones/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    mostrarMensaje("Renglón eliminado");
    obtenerRenglones();
  } catch (error) {
    mostrarMensaje("Error al eliminar", "error");
  }
};

  // ================= COLUMNAS =================
  const columnas = [
    { field: "id_renglon", headerName: "ID", width: 90 },
    { field: "codigo", headerName: "Código", width: 120 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    { field: "tipo_presupuestario", headerName: "Tipo", width: 200 },
    {
      field: "activo",
      headerName: "Activo",
      width: 120,
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => abrirModal(params.row)}>
            <EditIcon />
          </IconButton>

          {/* <IconButton onClick={() => eliminarRenglon(params.row.id_renglon)}>
            <DeleteIcon color="error" />
          </IconButton> */}
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Renglones
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          component={Link}
          to="/dashboard/renglones/crear"
        >
          Crear Renglón
        </Button>
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={renglones}
          columns={columnas}
          getRowId={(row) => row.id_renglon}
        />
      </div>

      {/* ================= MODAL EDITAR ================= */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        disableEnforceFocus={false}
        disableAutoFocus={false}
        disableRestoreFocus={false}
        <DialogTitle>Editar Renglón</DialogTitle>

        <DialogContent>
          <TextField
            label="Código"
            name="codigo"
            fullWidth
            margin="normal"
            value={renglonEdit?.codigo || ""}
            onChange={handleChange}
          />

          <TextField
            label="Descripción"
            name="descripcion"
            fullWidth
            margin="normal"
            value={renglonEdit?.descripcion || ""}
            onChange={handleChange}
          />

          <TextField
            label="Tipo Presupuestario"
            name="tipo_presupuestario"
            fullWidth
            margin="normal"
            value={renglonEdit?.tipo_presupuestario || ""}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarCambios}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= SNACKBAR ================= */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}