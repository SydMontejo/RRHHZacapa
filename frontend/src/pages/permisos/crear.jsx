// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box, Button, TextField, MenuItem, Typography, Grid, Paper,
//   Alert, CircularProgress, FormControl, InputLabel, Select
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export default function CrearPermiso() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("access");
//   const [form, setForm] = useState({
//     id_empleado: "",
//     motivo: "",
//     fecha_requerida: "",
//     dias_solicitados: 1,
//     documento: null,
//   });
//   const [empleados, setEmpleados] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/api/empleados/", {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => setEmpleados(res.data))
//       .catch(() => setError("No se pudieron cargar los empleados"))
//       .finally(() => setLoading(false));
//   }, [token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setForm(prev => ({ ...prev, documento: e.target.files[0] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     const data = new FormData();
//     data.append("id_empleado", form.id_empleado);
//     data.append("motivo", form.motivo);
//     data.append("fecha_requerida", form.fecha_requerida);
//     data.append("dias_solicitados", form.dias_solicitados);
//     if (form.documento) data.append("documento", form.documento);

//     try {
//       await axios.post("http://127.0.0.1:8000/api/permisos/", data, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
//       });
//       alert("Permiso solicitado correctamente");
//       navigate("/dashboard/permisos");
//     } catch (err) {
//       setError(err.response?.data?.detail || "Error al enviar la solicitud");
//     }
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
//       <Paper sx={{ p: 4 }}>
//         <Typography variant="h4" gutterBottom>Solicitar Permiso</Typography>
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <FormControl fullWidth required>
//                 <InputLabel>Empleado</InputLabel>
//                 <Select
//                   name="id_empleado"
//                   value={form.id_empleado}
//                   onChange={handleChange}
//                   label="Empleado"
//                 >
//                   <MenuItem value="">Seleccione</MenuItem>
//                   {empleados.map(emp => (
//                     <MenuItem key={emp.id_empleado} value={emp.id_empleado}>
//                       {emp.persona_nombre}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 required
//                 multiline
//                 rows={3}
//                 name="motivo"
//                 label="Motivo del permiso"
//                 value={form.motivo}
//                 onChange={handleChange}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 required
//                 type="date"
//                 name="fecha_requerida"
//                 label="Fecha requerida"
//                 value={form.fecha_requerida}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 required
//                 type="number"
//                 name="dias_solicitados"
//                 label="Días solicitados"
//                 value={form.dias_solicitados}
//                 onChange={handleChange}
//                 InputProps={{ inputProps: { min: 1, step: 1 } }}
//                 helperText="Número de días que necesita el permiso"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button variant="outlined" component="label" fullWidth>
//                 Subir documento (PDF)
//                 <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
//               </Button>
//               {form.documento && <Typography variant="caption">{form.documento.name}</Typography>}
//             </Grid>
//           </Grid>
//           <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
//             <Button variant="outlined" onClick={() => navigate("/dashboard/permisos")}>Cancelar</Button>
//             <Button type="submit" variant="contained">Enviar solicitud</Button>
//           </Box>
//         </form>
//       </Paper>
//     </Box>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Grid, Paper,
  Alert, CircularProgress, Autocomplete
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CrearPermiso() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [form, setForm] = useState({
    id_empleado: "",
    motivo: "",
    fecha_requerida: "",
    dias_solicitados: 1,
    documento: null,
  });
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadosOptions, setEmpleadosOptions] = useState([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);
  const [error, setError] = useState("");

  const buscarEmpleados = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      setEmpleadosOptions([]);
      return;
    }
    setLoadingEmpleados(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/empleados/?search=${inputValue}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmpleadosOptions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEmpleados(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_empleado) {
      setError("Debe seleccionar un empleado");
      return;
    }
    setError("");
    const data = new FormData();
    data.append("id_empleado", form.id_empleado);
    data.append("motivo", form.motivo);
    data.append("fecha_requerida", form.fecha_requerida);
    data.append("dias_solicitados", form.dias_solicitados);
    if (form.documento) data.append("documento", form.documento);

    try {
      await axios.post("http://127.0.0.1:8000/api/permisos/", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Permiso solicitado correctamente");
      navigate("/dashboard/permisos");
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
        <Typography variant="h4" gutterBottom>Solicitar Permiso</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={empleadosOptions}
                loading={loadingEmpleados}
                getOptionLabel={(option) => `${option.numero_empleado} - ${option.persona_nombre} (${option.id_persona?.dpi || 'Sin DPI'})`}
                isOptionEqualToValue={(option, value) => option.id_empleado === value?.id_empleado}
                onInputChange={(event, newInputValue) => buscarEmpleados(newInputValue)}
                onChange={(event, newValue) => {
                  setEmpleadoSeleccionado(newValue);
                  setForm(prev => ({ ...prev, id_empleado: newValue?.id_empleado || "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empleado"
                    required
                    helperText="Buscar por número de empleado, DPI o nombre"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                name="motivo"
                label="Motivo del permiso"
                value={form.motivo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="fecha_requerida"
                label="Fecha requerida"
                value={form.fecha_requerida}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                name="dias_solicitados"
                label="Días solicitados"
                value={form.dias_solicitados}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1, step: 1 } }}
                helperText="Número de días que necesita el permiso"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Subir documento (PDF)
                <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
              </Button>
              {form.documento && <Typography variant="caption">{form.documento.name}</Typography>}
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => navigate("/dashboard/permisos")}>Cancelar</Button>
            <Button type="submit" variant="contained">Enviar solicitud</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}