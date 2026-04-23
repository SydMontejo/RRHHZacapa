import { useEffect, useState } from "react";
import {
  Box, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Button,
  Snackbar, Alert, Switch, FormControlLabel, Paper, Stack
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Link } from "react-router-dom";


export default function ListarPersonas() {
  const [personas, setPersonas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [personaEdit, setPersonaEdit] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("access");
  const [rows, setRows] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const obtenerPersonas = async (query = "") => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/personas/?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPersonas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerPersonas();
  }, []);

  const mostrarMensaje = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirModal = (row) => {
    setPersonaEdit({ ...row, foto: null });
    if (row.foto){
      setPreview('http://127.0.0.1:8000${row.foto}');
    }else{
      setPreview(null);
    }
    setOpenModal(true);
    console.log(row.foto);
  };

  const handleChange = (e) => {
    setPersonaEdit({
      ...personaEdit,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPersonaEdit({
      ...personaEdit,
      foto: file,
    });

    if (file){
      setPreview(URL.createObjectURL(file));
    }
  };

  const guardarCambios = async () => {
    const formData = new FormData();

    Object.keys(personaEdit).forEach((key) => {
      if (personaEdit[key] !== null) {
        formData.append(key, personaEdit[key]);
      }
    });

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/personas/${personaEdit.id_persona}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      mostrarMensaje("Actualizado");
      setOpenModal(false);
      obtenerPersonas();
    } catch {
      mostrarMensaje("Error", "error");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar persona?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/personas/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mostrarMensaje("Eliminado");
      obtenerPersonas();
    } catch {
      mostrarMensaje("Error", "error");
    }
  };

  const columnas = [
    {
      field: "dpi",
      headerName: "DPI",
      width: 140,
    },
    
    {
    field: "fulname",
    headerName: "Nombre Completo",
    width: 250,
    renderCell: (params) => {
      if (!params?.row) return '';
      const row = params.row;
      const primer = row.primer_nombre ?? '';
      const segundo = row.segundo_nombre ?? '';
      const primerApe = row.primer_apellido ?? '';
      const segundoApe = row.segundo_apellido ?? '';
      return `${primer} ${segundo} ${primerApe} ${segundoApe}`.trim();
      },
    },
    { field: "nit", headerName: "NIT", width: 150 },
    { field: "departamento", headerName: "Departamento", width: 150 },
    { field: "municipio", headerName: "Municipio", width: 150 },
    { field: "correo", headerName: "Correo", width: 200 },
    {
      field: "activo",
      headerName: "Activo",
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => abrirModal(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => eliminar(params.row.id_persona)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
  <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4, px: 2 }}>

    <Paper sx={{ p: 3, borderRadius: 3 }}>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Personas
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/dashboard/personas/crear"
        >
          + Crear persona
        </Button>
      </Box>

      {/* Busqueda */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          label="Buscar persona"
          fullWidth
          size="small"
          onChange={(e) => obtenerPersonas(e.target.value)}
        />
      </Paper>

      {/* Tabla */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={personas}
          columns={columnas}
          getRowId={(row) => row.id_persona}
          sx={{
            borderRadius: 2,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f1f5f9",
              fontWeight: "bold",
            },
          }}
        />
      </Box>

    </Paper>

    {/* Modal */}
    <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>

      <DialogTitle sx={{ fontWeight: "bold" }}>
        Editar persona
      </DialogTitle>

      <DialogContent dividers>

        {/* Informacion base */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Información actual
          </Typography>

          <Typography variant="body2">
            <strong>Nombre:</strong> {personaEdit?.primer_nombre} {personaEdit?.segundo_nombre ? personaEdit.segundo_nombre + ' ' : ''}{personaEdit?.primer_apellido} {personaEdit?.segundo_apellido ? personaEdit.segundo_apellido : ''}
          </Typography>

          <Typography variant="body2">
            <strong>DPI:</strong> {personaEdit?.dpi} | <strong>NIT:</strong> {personaEdit?.nit || 'N/A'}
          </Typography>

          <Typography variant="body2">
            <strong>Correo:</strong> {personaEdit?.correo}
          </Typography>
        </Paper>

        {/* Campos editables */}
        <Stack spacing={2}>

          <TextField
            name="direccion"
            label="Dirección"
            fullWidth
            value={personaEdit?.direccion || ""}
            onChange={handleChange}
            multiline
            rows={2}
          />

          <TextField
            name="telefono"
            label="Teléfono"
            fullWidth
            value={personaEdit?.telefono || ""}
            onChange={handleChange}
          />

          <TextField
            name="correo"
            label="Correo electrónico"
            fullWidth
            value={personaEdit?.correo || ""}
            onChange={handleChange}
          />

          <TextField
            name="departamento"
            label="Departamento"
            fullWidth
            value={personaEdit?.departamento || ""}
            onChange={handleChange}
          />

          <TextField
            name="municipio"
            label="Municipio"
            fullWidth
            value={personaEdit?.municipio || ""}
            onChange={handleChange}
          />

        </Stack>

        {/* Imagen */}
        {preview && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <img
              src={preview}
              alt="Foto"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />
          </Box>
        )}

        {/* Documento */}
        <Box
          component="label"
          sx={{
            mt: 2,
            border: "2px dashed #ccc",
            borderRadius: 2,
            p: 2,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            "&:hover": { borderColor: "#1976d2", bgcolor: "#f8fafc" },
          }}
        >
          <Typography variant="body2">
            Cambiar imagen
          </Typography>
          <input type="file" hidden onChange={handleFileChange} />
        </Box>

        {/* Estado */}
        <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={personaEdit?.activo || false}
                onChange={(e) =>
                  setPersonaEdit({
                    ...personaEdit,
                    activo: e.target.checked
                  })
                }
              />
            }
            label="Activo"
          />
        </Paper>

      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenModal(false)}>
          Cancelar
        </Button>

        <Button onClick={guardarCambios} variant="contained">
          Guardar
        </Button>
      </DialogActions>

    </Dialog>

    {/* Snackbar */}
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

