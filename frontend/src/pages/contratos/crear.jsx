import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Paper,
  Alert,
  CircularProgress, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function CrearContrato() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    id_empleado: "",
    tipo_contrato: "",
    id_renglon: "",
    id_servicio: "",
    fecha_inicio: "",
    fecha_fin: "",
    salario: ""
  });

  const [empleados, setEmpleados] = useState([]);
  const [renglones, setRenglones] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get("http://127.0.0.1:8000/api/empleados/", { headers }),
      axios.get("http://127.0.0.1:8000/api/renglones/", { headers }),
      axios.get("http://127.0.0.1:8000/api/servicios/", { headers })
    ])
      .then(([emp, ren, ser]) => {
        setEmpleados(emp.data);
        setRenglones(ren.data);
        setServicios(ser.data);
      })
      .catch(() => setError("Error al cargar datos necesarios"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/api/contratos/", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Contrato creado exitosamente");
      navigate("/dashboard/contratos"); // redirige al listado
    } catch (err) {
      setError(err.response?.data?.detail || "Error al crear contrato");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
  <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 3 }}>
    
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Crear Contrato
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/* Empleado*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Información del empleado
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel id="empleado-label">Empleado</InputLabel>
              <Select
                labelId="empleado-label"
                name="id_empleado"
                value={form.id_empleado}
                onChange={handleChange}
                label="Empleado"
              >
                <MenuItem value="">Seleccione un empleado</MenuItem>
                {empleados.map(emp => (
                  <MenuItem key={emp.id_empleado} value={emp.id_empleado}>
                    {emp.persona_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Datos del contrato nuevo*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Datos del contrato
            </Typography>

            <TextField
              fullWidth
              required
              name="tipo_contrato"
              label="Tipo de contrato"
              value={form.tipo_contrato}
              onChange={handleChange}
              placeholder="Ej: 011, 022"
              size="small"
            />
          </Paper>

          {/* Asignaciones*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Asignación
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="renglon-label">Renglón</InputLabel>
                  <Select
                    labelId="renglon-label"
                    name="id_renglon"
                    value={form.id_renglon}
                    onChange={handleChange}
                    label="Renglón"
                  >
                    <MenuItem value="">Seleccione un renglón</MenuItem>
                    {renglones.map(ren => (
                      <MenuItem key={ren.id_renglon} value={ren.id_renglon}>
                        {ren.codigo} {ren.nombre && `- ${ren.nombre}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="servicio-label">Servicio</InputLabel>
                  <Select
                    labelId="servicio-label"
                    name="id_servicio"
                    value={form.id_servicio}
                    onChange={handleChange}
                    label="Servicio"
                  >
                    <MenuItem value="">Seleccione un servicio</MenuItem>
                    {servicios.map(ser => (
                      <MenuItem key={ser.id_servicio} value={ser.id_servicio}>
                        {ser.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Condiciones*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Condiciones del contrato
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
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

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  name="fecha_fin"
                  label="Fecha fin (opcional)"
                  value={form.fecha_fin}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="salario"
                  label="Salario"
                  type="number"
                  value={form.salario}
                  onChange={handleChange}
                  InputProps={{ inputProps: { step: "0.01", min: "0" } }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Botones*/}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/contratos")}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained">
              Guardar contrato
            </Button>
          </Box>

        </Stack>
      </form>
    </Paper>
  </Box>
);
}