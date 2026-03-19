import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

export default function CrearServicio() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post("http://127.0.0.1:8000/api/servicios/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Servicio creado correctamente");
      setTimeout(() => navigate("/dashboard/servicios"), 1500);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setError("No autorizado. Verifica tu sesión.");
      } else {
        setError("Error al crear el servicio");
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Crear Servicio
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Descripción"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
        // La descripción es opcional en el modelo
      />

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Guardar
      </Button>
    </Box>
  );
}