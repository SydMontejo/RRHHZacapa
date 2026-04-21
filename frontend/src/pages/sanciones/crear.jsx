import { useState } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Grid, Paper,
  Alert, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CrearSancion() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [form, setForm] = useState({
    id_empleado: "",
    fecha_sancion: "",
    detalle: "",
    documento: null,
  });
  const [empleado, setEmpleado] = useState(null);
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  const handleBuscarEmpleado = async () => {
  if (!numeroEmpleado) {
    setError("Ingrese número de empleado");
    return;
  }
  setBuscando(true);
  setError("");
  try {
    // Endpoint de búsqueda
    const response = await axios.get(
      `http://127.0.0.1:8000/api/empleados/?search=${numeroEmpleado}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const empleados = response.data;
    // Buscar coincidencia exacta por número de empleado
    const emp = empleados.find(e => e.numero_empleado === numeroEmpleado);
    if (!emp) {
      throw new Error(`No se encontró empleado con número ${numeroEmpleado}`);
    }
    setEmpleado(emp);
    setForm(prev => ({ ...prev, id_empleado: emp.id_empleado }));
  } catch (err) {
    console.error(err);
    setError(err.message || "Empleado no encontrado");
    setEmpleado(null);
    setForm(prev => ({ ...prev, id_empleado: "" }));
  } finally {
    setBuscando(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_empleado) {
      setError("Debe buscar y seleccionar un empleado");
      return;
    }
    if (!form.fecha_sancion || !form.detalle) {
      setError("Fecha y detalle son obligatorios");
      return;
    }
    setError("");
    const data = new FormData();
    data.append("id_empleado", form.id_empleado);
    data.append("fecha_sancion", form.fecha_sancion);
    data.append("detalle", form.detalle);
    if (form.documento) data.append("documento", form.documento);

    try {
      await axios.post("http://127.0.0.1:8000/api/sanciones/", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Sanción registrada correctamente");
      navigate("/dashboard/sanciones");
    } catch (err) {
      setError(err.response?.data?.detail || "Error al guardar");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, documento: e.target.files[0] }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Registrar Sanción</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Búsqueda por número de empleado */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  label="Número de empleado"
                  value={numeroEmpleado}
                  onChange={(e) => setNumeroEmpleado(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleBuscarEmpleado}
                  disabled={buscando}
                >
                  {buscando ? <CircularProgress size={24} /> : "Buscar"}
                </Button>
              </Box>
              {empleado && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  {empleado.persona_nombre} - {empleado.numero_empleado}
                </Alert>
              )}
            </Grid>

            {/* Fecha sanción */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="fecha_sancion"
                label="Fecha de sanción"
                value={form.fecha_sancion}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Detalle */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                name="detalle"
                label="Detalle de la sanción (máx. 500 caracteres)"
                value={form.detalle}
                onChange={handleChange}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>

            {/* Documento opcional */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Subir documento (PDF opcional)
                <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
              </Button>
              {form.documento && <Typography variant="caption">{form.documento.name}</Typography>}
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => navigate("/dashboard/sanciones")}>Cancelar</Button>
            <Button type="submit" variant="contained">Registrar Sanción</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}