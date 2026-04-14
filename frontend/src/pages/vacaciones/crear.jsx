import { useState } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Grid, Paper,
  Alert, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CrearVacacion() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [form, setForm] = useState({
    id_empleado: "",
    fecha_inicio: "",
    fecha_fin: "",
    documento: null,
  });
  const [empleado, setEmpleado] = useState(null);
  const [dpi, setDpi] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  const handleBuscarEmpleado = async () => {
    if (!dpi) {
      setError("Ingrese un DPI");
      return;
    }
    setBuscando(true);
    setError("");
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/empleados/por_dpi/?dpi=${dpi}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const emp = response.data;
      setEmpleado(emp);
      setForm(prev => ({ ...prev, id_empleado: emp.id_empleado }));
    } catch (err) {
      setError(err.response?.data?.error || "Empleado no encontrado");
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
    if (!form.fecha_inicio || !form.fecha_fin) {
      setError("Debe seleccionar fechas de inicio y fin");
      return;
    }
    setError("");
    const data = new FormData();
    data.append("id_empleado", form.id_empleado);
    data.append("fecha_inicio", form.fecha_inicio);
    data.append("fecha_fin", form.fecha_fin);
    if (form.documento) data.append("documento_autorizacion", form.documento);

    try {
      console.log("Enviando id_empleado:", form.id_empleado);
      await axios.post("http://127.0.0.1:8000/api/vacaciones/", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Solicitud de vacaciones enviada correctamente");
      navigate("/dashboard/vacaciones");
    } catch (err) {
      setError(err.response?.data?.detail || "Error al enviar la solicitud");
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
        <Typography variant="h4" gutterBottom>Solicitar Vacaciones</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Búsqueda por DPI */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  label="DPI del empleado"
                  value={dpi}
                  onChange={(e) => setDpi(e.target.value)}
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
                  {empleado.persona_detalle?.primer_nombre} {empleado.persona_detalle?.primer_apellido} - {empleado.numero_empleado}
                </Alert>
              )}
            </Grid>

            {/* Fechas */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="fecha_inicio"
                label="Fecha inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="fecha_fin"
                label="Fecha fin"
                value={form.fecha_fin}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Documento */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Subir documento de autorización (PDF)
                <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
              </Button>
              {form.documento && <Typography variant="caption">{form.documento.name}</Typography>}
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => navigate("/dashboard/vacaciones")}>Cancelar</Button>
            <Button type="submit" variant="contained">Enviar solicitud</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}