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
  FormControlLabel
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
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5">Crear Empleado</Typography>

      <Box component="form" onSubmit={handleSubmit}>

        <TextField
          select
          label="Persona"
          name="id_persona"
          value={form.id_persona}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!!personaId}
        >
          <MenuItem value="">Seleccione</MenuItem>
          {personas.map(p => (
            <MenuItem key={p.id_persona} value={p.id_persona}>
              {p.primer_nombre} {p.primer_apellido} - {p.dpi}
            </MenuItem>
          ))}
        </TextField>

        <TextField label="Número Empleado" name="numero_empleado" onChange={handleChange} fullWidth margin="normal" />

        <TextField type="date" name="fecha_contratacion" onChange={handleChange} fullWidth margin="normal" label="Fecha de contratacion" InputLabelProps={{shrink: true}}/>

        <TextField select label="Renglón" name="id_renglon" onChange={handleChange} fullWidth margin="normal">
          <MenuItem value="">Seleccione</MenuItem>
          {renglones.map(r => (
            <MenuItem key={r.id_renglon} value={r.id_renglon}>{r.codigo}</MenuItem>
          ))}
        </TextField>

        <TextField select label="Servicio" name="id_servicio" onChange={handleChange} fullWidth margin="normal">
          <MenuItem value="">Seleccione</MenuItem>
          {servicios.map(s => (
            <MenuItem key={s.id_servicio} value={s.id_servicio}>{s.nombre}</MenuItem>
          ))}
        </TextField>

        <TextField label="Puesto Oficial" name="puesto_oficial" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Especialización" name="especializacion" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Colegiado Activo" name="colegiado_activo" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Ubicación Física" name="ubicacion_fisica" onChange={handleChange} fullWidth margin="normal" />

        <TextField label="Comisionado Sección Número" name="comisionado_seccion_numero" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Comisionado Sección Nombre" name="comisionado_seccion_nombre" onChange={handleChange} fullWidth margin="normal" />

        <FormControlLabel
          control={<Switch checked={form.activo} onChange={handleChange} name="activo" />}
          label="Activo"
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Guardar
        </Button>

      </Box>
    </Box>
  );
}