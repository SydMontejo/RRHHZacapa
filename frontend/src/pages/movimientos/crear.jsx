import { useState } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Grid, Paper,
  Alert, CircularProgress, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CrearMovimiento() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [form, setForm] = useState({
    id_empleado: "",
    tipo: "",
    fecha_efectiva: "",
    descripcion: "",
  });
  const [empleado, setEmpleado] = useState(null);
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  const getNombreCompleto = (persona) => {
    if (!persona) return "";
    const nombres = [persona.primer_nombre, persona.segundo_nombre, persona.tercer_nombre].filter(Boolean).join(" ");
    const apellidos = [persona.primer_apellido, persona.segundo_apellido, persona.apellido_casada].filter(Boolean).join(" ");
    return `${nombres} ${apellidos}`.trim();
  };

  const handleBuscarEmpleado = async () => {
    if (!numeroEmpleado) {
      setError("Ingrese número de empleado");
      return;
    }
    setBuscando(true);
    setError("");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/empleados/por_numero/?numero=${numeroEmpleado}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const emp = response.data;
      setEmpleado(emp);
      setForm(prev => ({ ...prev, id_empleado: emp.id_empleado }));
    } catch (err) {
      setError("Empleado no encontrado");
      setEmpleado(null);
    } finally {
      setBuscando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_empleado) { setError("Busque un empleado primero"); return; }
    if (!form.tipo) { setError("Ingrese el tipo de movimiento"); return; }
    if (!form.fecha_efectiva) { setError("Seleccione la fecha efectiva"); return; }
    if (!form.descripcion) { setError("Describa el movimiento"); return; }

    try {
      await axios.post("http://127.0.0.1:8000/api/movimientos-personal/", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/dashboard/movimientos");
    } catch (err) {
      setError("Error al registrar el movimiento");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "flex", justifyContent: "center", bgcolor: "#eef2f7", minHeight: "100vh" }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 900, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Registrar Movimiento de Personal
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Búsqueda de empleado */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Empleado
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Número de empleado"
                    value={numeroEmpleado}
                    onChange={(e) => setNumeroEmpleado(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleBuscarEmpleado}
                    disabled={buscando}
                  >
                    {buscando ? <CircularProgress size={20} /> : "Buscar"}
                  </Button>
                </Grid>
                {empleado && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      {getNombreCompleto(empleado.persona_detalle)} - {empleado.numero_empleado}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Datos del movimiento */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Datos del movimiento
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Tipo de movimiento"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    placeholder="Ej: Entrega de Puesto, Toma de Puesto"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    name="fecha_efectiva"
                    label="Fecha efectiva"
                    value={form.fecha_efectiva}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    name="descripcion"
                    label="Descripción (máx. 500 caracteres)"
                    value={form.descripcion}
                    onChange={handleChange}
                    inputProps={{ maxLength: 500 }}
                    placeholder="Detalle del movimiento..."
                  />
                </Grid>
              </Grid>
            </Paper>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => navigate("/dashboard/movimientos")}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                Registrar Movimiento
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}