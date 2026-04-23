import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Switch,
  FormControlLabel, Paper, Stack, Grid
} from "@mui/material";

export default function CrearEmpleado() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access");

  const queryParams = new URLSearchParams(location.search);
  const personaId = queryParams.get("persona");
  const initialPersonaId = personaId ? Number(personaId) : "";
  const [form, setForm] = useState({
    id_persona: initialPersonaId,
    numero_empleado: "",
    fecha_contratacion: "",
    id_renglon: "",
    id_servicio: "",
    puesto_oficial: "",
    especializacion: "",
    colegiado_activo: "",
    ubicacion_fisica: "",
    comisionado_seccion_numero: "",
    comisionado_seccion_nombre: "",
    activo: true,
  });

  const [personas, setPersonas] = useState([]);
  const [renglones, setRenglones] = useState([]);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    // 🔥 SOLO PERSONAS SIN EMPLEADO
    axios.get("http://127.0.0.1:8000/api/empleados/personas_disponibles/", { headers })
      .then(res => setPersonas(res.data));

    axios.get("http://127.0.0.1:8000/api/renglones/", { headers })
      .then(res => setRenglones(res.data));

    axios.get("http://127.0.0.1:8000/api/servicios/", { headers })
      .then(res => setServicios(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.id_persona || form.id_persona === "") {
      alert("Debe seleccionar una persona");
      return;
    }

    const dataToSend = {
      ...form,
      id_persona: Number(form.id_persona),
    };

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/empleados/",
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard/empleados");

    } catch (error) {
      console.error(error);
      alert("Error al crear empleado");
    }
  };

  return (
  <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>
    
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Crear Empleado
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/* Persona*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Persona
            </Typography>

            <TextField
              select
              label="Persona"
              name="id_persona"
              value={form.id_persona}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={!!personaId}
            >
              <MenuItem value="">Seleccione</MenuItem>
              {personas.map(p => (
                <MenuItem key={p.id_persona} value={p.id_persona}>
                  {p.primer_nombre} {p.primer_apellido} - {p.dpi}
                </MenuItem>
              ))}
            </TextField>
          </Paper>

          {/* Datos*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Datos del empleado
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Número de empleado"
                  name="numero_empleado"
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  name="fecha_contratacion"
                  onChange={handleChange}
                  fullWidth
                  label="Fecha de contratación"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Asignacion */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Asignación
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Renglón"
                  name="id_renglon"
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">Seleccione</MenuItem>
                  {renglones.map(r => (
                    <MenuItem key={r.id_renglon} value={r.id_renglon}>
                      {r.codigo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Servicio"
                  name="id_servicio"
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">Seleccione</MenuItem>
                  {servicios.map(s => (
                    <MenuItem key={s.id_servicio} value={s.id_servicio}>
                      {s.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          {/* Informacion profesional*/}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Información profesional
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Puesto oficial" name="puesto_oficial" onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Especialización" name="especializacion" onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Colegiado activo" name="colegiado_activo" onChange={handleChange} fullWidth size="small" />
              </Grid>
            </Grid>
          </Paper>

          {/* Ubicacion y Comision */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Ubicación y Comisionado
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Ubicación física"
                  name="ubicacion_fisica"
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Comisionado número"
                  name="comisionado_seccion_numero"
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Comisionado nombre"
                  name="comisionado_seccion_nombre"
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Estado*/}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={handleChange}
                  name="activo"
                />
              }
              label="Activo"
            />
          </Paper>

          {/* Boton*/}
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