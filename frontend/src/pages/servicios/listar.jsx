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
import axios from "axios";

export default function ListarServicios() {
  const [servicios, setServicios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [servicioEdit, setServicioEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ================= OBTENER =================
  const obtenerServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/servicios/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicios(res.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setError("No autorizado. Verifica tu sesión.");
      } else {
        setError("Error al cargar los servicios.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  // ================= SNACKBAR =================
  const mostrarMensaje = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ================= EDITAR =================
  const abrirModal = (row) => {
    setServicioEdit(row);
    setOpenModal(true);
  };

  const handleChange = (e) => {
    setServicioEdit({
      ...servicioEdit,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/servicios/${servicioEdit.id_servicio}/`,
        servicioEdit,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje("Servicio actualizado");
      setOpenModal(false);
      obtenerServicios();
    } catch (error) {
      mostrarMensaje("Error al actualizar", "error");
    }
  };

  // ================= ELIMINAR =================
  const eliminarServicio = async (id) => {
    const confirmacion = window.confirm("¿Eliminar este servicio?");
    if (!confirmacion) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/servicios/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mostrarMensaje("Servicio eliminado");
      obtenerServicios();
    } catch (error) {
      mostrarMensaje("Error al eliminar", "error");
    }
  };

  // ================= COLUMNAS =================
  const columnas = [
    { field: "id_servicio", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
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
          <IconButton onClick={() => eliminarServicio(params.row.id_servicio)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Servicios
      </Typography>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={servicios}
          columns={columnas}
          getRowId={(row) => row.id_servicio}
          loading={loading}
          error={error}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
        />
      </div>

      {/* ================= MODAL EDITAR ================= */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        disableEnforceFocus={false}
        disableAutoFocus={false}
        disableRestoreFocus={false}
      >
        <DialogTitle>Editar Servicio</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            margin="normal"
            value={servicioEdit?.nombre || ""}
            onChange={handleChange}
            required
          />
          <TextField
            label="Descripción"
            name="descripcion"
            fullWidth
            margin="normal"
            value={servicioEdit?.descripcion || ""}
            onChange={handleChange}
            multiline
            rows={3}
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