import { useEffect, useState } from "react";
import {
  Box, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Button,
  Snackbar, Alert, Switch, FormControlLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";


export default function ListarPersonas() {
  const [personas, setPersonas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [personaEdit, setPersonaEdit] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("access");

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
      field: "foto",
      headerName: "Foto",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <img
            src={`http://127.0.0.1:8000${params.value}`}
            width="40"
          />
        ) : "N/A",
    },
    { field: "nombres", headerName: "Nombres", width: 150 },
    { field: "apellidos", headerName: "Apellidos", width: 150 },
    { field: "dpi", headerName: "DPI", width: 150 },
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Personas</Typography>

      <TextField
  label="Buscar persona"
  fullWidth
  sx={{ mb: 2 }}
  onChange={(e) => obtenerPersonas(e.target.value)}
/>

      <div style={{ height: 500 }}>
        <DataGrid
          rows={personas}
          columns={columnas}
          getRowId={(row) => row.id_persona}
        />
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Editar Persona</DialogTitle>
        <DialogContent>

          <TextField name="nombres" label="Nombres" fullWidth margin="normal"
            value={personaEdit?.nombres || ""} onChange={handleChange} />

          <TextField name="apellidos" label="Apellidos" fullWidth margin="normal"
            value={personaEdit?.apellidos || ""} onChange={handleChange} />

          {preview && (
  <Box sx={{ mb: 2, textAlign: "center" }}>
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
          
          <input type="file" onChange={handleFileChange} />

          <FormControlLabel
            control={
              <Switch
                checked={personaEdit?.activo || false}
                onChange={(e) =>
                  setPersonaEdit({ ...personaEdit, activo: e.target.checked })
                }
              />
            }
            label="Activo"
          />

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button onClick={guardarCambios} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

