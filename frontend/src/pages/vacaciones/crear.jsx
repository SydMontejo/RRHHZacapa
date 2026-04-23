import { useState } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Grid, Paper,
  Alert, CircularProgress, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  // Función para obtener nombre completo desde persona_detalle
  const getNombreCompleto = (persona) => {
    if (!persona) return "";
    const nombres = [persona.primer_nombre, persona.segundo_nombre, persona.tercer_nombre]
      .filter(Boolean)
      .join(" ");
    const apellidos = [persona.primer_apellido, persona.segundo_apellido, persona.apellido_casada]
      .filter(Boolean)
      .join(" ");
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
      await axios.post("http://127.0.0.1:8000/api/vacaciones/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
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
  <Box
    sx={{
      maxWidth: 900,
      mx: "auto",
      mt: 4,
      px: 2,
    }}
  >
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Solicitar Vacaciones
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/* 🔹 SECCIÓN 1: BÚSQUEDA */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Buscar empleado
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
                    {getNombreCompleto(empleado.persona_detalle)} - #{empleado.numero_empleado}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* 🔹 SECCIÓN 2: FECHAS */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Período de vacaciones
            </Typography>

            <Grid container spacing={2}>
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
                  size="small"
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
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* 🔹 SECCIÓN 3: DOCUMENTO */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Documento de autorización
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
                justifyContent: "center",
                gap: 1,

                minHeight: "120px",

                transition: "0.2s",
                "&:hover": {
                  borderColor: "#1976d2",
                  bgcolor: "#f8fafc",
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 36, color: "#6b7280" }} />

              <Typography variant="body2" color="text.secondary">
                {form.documento
                  ? form.documento.name
                  : "Haga clic para adjuntar un PDF"}
              </Typography>

              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </Box>
          </Paper>

          {/* 🔹 BOTONES */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/vacaciones")}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained">
              Enviar solicitud
            </Button>
          </Box>

        </Stack>
      </form>
    </Paper>
  </Box>
);
}