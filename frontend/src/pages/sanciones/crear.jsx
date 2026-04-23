import { useState } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Grid, Paper,
  Alert, CircularProgress, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
  <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Registrar Sanción
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/*Busqueda*/}
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
                    {`${empleado.persona_detalle?.primer_nombre || ''} ${empleado.persona_detalle?.segundo_nombre || ''} ${empleado.persona_detalle?.tercer_nombre || ''} ${empleado.persona_detalle?.primer_apellido || ''} ${empleado.persona_detalle?.segundo_apellido || ''} ${empleado.persona_detalle?.apellido_casada || ''}`.replace(/\s+/g, ' ').trim()}
                    {" - "}
                    {empleado.persona_detalle?.dpi}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Fecha*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Fecha de la sanción
            </Typography>

            <TextField
              fullWidth
              required
              type="date"
              name="fecha_sancion"
              label="Fecha de sanción"
              value={form.fecha_sancion}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Paper>

          {/* Detalle*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Detalle de la sanción
            </Typography>

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              name="detalle"
              label="Descripción (máx. 500 caracteres)"
              value={form.detalle}
              onChange={handleChange}
              inputProps={{ maxLength: 500 }}
            />
          </Paper>

          {/* Documenot*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Documento adjunto (opcional)
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

          {/* Botones */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/sanciones")}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained">
              Registrar sanción
            </Button>
          </Box>

        </Stack>
      </form>
    </Paper>
  </Box>
);
}