import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Switch,
  FormControlLabel, Paper, Stack, Grid
} from "@mui/material";

export default function CrearPersona() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre:"",
    tercer_nombre:"",
    primer_apellido: "",
    segundo_apellido:"",
    tercer_apellido:"",
    apellido_casada:"",
    dpi: "",
    correo: "",
    telefono: "",
    direccion: "",
    departamento:"",
    municipio:"",
    nit: "",
    activo: true,
    foto: null
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dpi") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 13) return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      foto: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.dpi.length !== 13) {
      setError("El DPI debe tener 13 dígitos");
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/personas/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Persona creada correctamente");
      setTimeout(() => navigate("/dashboard/personas"), 1500);

    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        setError(JSON.stringify(error.response.data));
      } else {
        setError("Error al crear persona");
      }
    }
  };

  return (
  <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>
    
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Crear Persona
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/* NOMBRES */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Nombres
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Primer Nombre" name="primer_nombre" onChange={handleChange} required size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Segundo Nombre" name="segundo_nombre" onChange={handleChange} required size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Tercer Nombre" name="tercer_nombre" onChange={handleChange} size="small" />
              </Grid>
            </Grid>
          </Paper>

          {/* APELLIDOS */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Apellidos
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Primer Apellido" name="primer_apellido" onChange={handleChange} required size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Segundo Apellido" name="segundo_apellido" onChange={handleChange} required size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Apellido de Casada" name="apellido_casada" onChange={handleChange} size="small" />
              </Grid>
            </Grid>
          </Paper>

          {/* IDENTIFICACIÓN */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Identificación
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="DPI" name="dpi" onChange={handleChange} required size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="NIT" name="nit" onChange={handleChange} required size="small" />
              </Grid>
            </Grid>
          </Paper>

          {/* CONTACTO */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Información de contacto
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Correo" name="correo" onChange={handleChange} required size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Teléfono" name="telefono" onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Dirección" name="direccion" onChange={handleChange} size="small" multiline rows={5} />
              </Grid>
            </Grid>
          </Paper>

          {/* UBICACIÓN */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Ubicación
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Departamento" name="departamento" onChange={handleChange} required size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Municipio" name="municipio" onChange={handleChange} required size="small" />
              </Grid>
            </Grid>
          </Paper>

          {/* FOTO */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Foto
            </Typography>

            <Box
              component="label"
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 3,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                minHeight: "100px",
                "&:hover": { borderColor: "#1976d2", bgcolor: "#f8fafc" },
              }}
            >
              <Typography variant="body2">
                Seleccionar fotografia
              </Typography>

              <input type="file" hidden onChange={handleFileChange} />
            </Box>
          </Paper>

          {/* ESTADO */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={(e) =>
                    setForm({ ...form, activo: e.target.checked })
                  }
                />
              }
              label="Activo"
            />
          </Paper>

          {/* BOTÓN */}
          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </Box>

        </Stack>
      </Box>
    </Paper>
  </Box>
);
}