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
  FormControlLabel
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
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5">Crear Persona</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField fullWidth label="Primer Nombre" name="primer_nombre" onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Segundo Nombre" name="segundo_nombre" onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Tercer Nombre" name="tercer_nombre" onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Primer Apellido" name="primer_apellido" onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Segundo Apellido" name="segundo_apellido" onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Tercer Apellido" name="tercer_apellido" onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Apellido de Casada" name="apellido_casada" onChange={handleChange} margin="normal"  />
      <TextField fullWidth label="DPI" name="dpi" onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="NIT" name="nit" onChange={handleChange} margin="normal" required/>
      <TextField fullWidth label="Correo" name="correo" onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Teléfono" name="telefono" onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Dirección" name="direccion" onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Departameto" name="departamento" onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Municipio" name="municipio" onChange={handleChange} margin="normal" required />
      

      <input type="file" onChange={handleFileChange} />

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

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Guardar
      </Button>
    </Box>
  );
}