// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   TextField,
//   Button,
//   MenuItem,
//   Typography
// } from "@mui/material";

// export default function CrearContrato() {

//   const token = localStorage.getItem("access");

//   const [form, setForm] = useState({
//     id_empleado: "",
//     tipo_contrato: "",
//     id_renglon: "",
//     id_servicio: "",
//     fecha_inicio: "",
//     salario: ""
//   });

//   const [empleados, setEmpleados] = useState([]);

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/api/empleados/", {
//       headers: { Authorization: `Bearer ${token}` }
//     }).then(res => setEmpleados(res.data));
//   }, []);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await axios.post("http://127.0.0.1:8000/api/contratos/", form, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     alert("Contrato creado");
//   };

//   return (
//     <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
//       <Typography variant="h5">Crear Contrato</Typography>

//       <form onSubmit={handleSubmit}>

//         <TextField
//           select
//           name="id_empleado"
//           label="Empleado"
//           fullWidth
//           margin="normal"
//           onChange={handleChange}
//         >
//           {empleados.map(e => (
//             <MenuItem key={e.id_empleado} value={e.id_empleado}>
//               {e.persona_nombre}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField name="tipo_contrato" label="Tipo (011,022)" fullWidth margin="normal" onChange={handleChange} />
//         <TextField type="date" name="fecha_inicio" fullWidth margin="normal" onChange={handleChange} />
//         <TextField name="salario" label="Salario" fullWidth margin="normal" onChange={handleChange} />

//         <Button type="submit" variant="contained">Guardar</Button>

//       </form>
//     </Box>
//   );
// }

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
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
      
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Crear Contrato
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Empleado */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required margin="normal" sx={{ width: '100%' }}>
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
            </Grid>

            {/* Tipo de contrato */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="tipo_contrato"
                label="Tipo de contrato"
                value={form.tipo_contrato}
                onChange={handleChange}
                placeholder="Ej: 011, 022"
                
              />
            </Grid>

            {/* Renglón (solo selección) */}
            <Grid item xs={12} md={12}>
              <FormControl fullWidth margin="normal">
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

            {/* Servicio */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
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

            {/* Fecha inicio */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="fecha_inicio"
                label="Fecha de inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                
              />
            </Grid>

            {/* Fecha fin (opcional) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                name="fecha_fin"
                label="Fecha de fin(opcional)"
                value={form.fecha_fin}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Salario */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="salario"
                label="Salario"
                type="number"
                value={form.salario}
                onChange={handleChange}
                InputProps={{ inputProps: { step: "0.01", min: "0" } }}
                helperText="Ingrese el salario mensual"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => navigate("/dashboard/contratos")}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" size="large">
              Guardar Contrato
            </Button>
          </Box>
        </form>
      
    </Box>
  );
}