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
//====================================================================================================================
// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box, Button, TextField, Typography, Grid, Paper,
//   Alert, CircularProgress, Autocomplete
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
//   const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
//   const [empleadosOptions, setEmpleadosOptions] = useState([]);
//   const [loadingEmpleados, setLoadingEmpleados] = useState(false);
//   const [error, setError] = useState("");

//   const buscarEmpleados = async (inputValue) => {
//     if (!inputValue || inputValue.length < 2) {
//       setEmpleadosOptions([]);
//       return;
//     }
//     setLoadingEmpleados(true);
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/empleados/?search=${inputValue}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setEmpleadosOptions(response.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingEmpleados(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.id_empleado) {
//       setError("Debe seleccionar un empleado");
//       return;
//     }
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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setForm(prev => ({ ...prev, documento: e.target.files[0] }));
//   };

//   return (
//     <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
//       <Paper sx={{ p: 4 }}>
//         <Typography variant="h4" gutterBottom>Solicitar Permiso</Typography>
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Autocomplete
//                 options={empleadosOptions}
//                 loading={loadingEmpleados}
//                 getOptionLabel={(option) => `${option.numero_empleado} - ${option.persona_nombre} (${option.id_persona?.dpi || 'Sin DPI'})`}
//                 isOptionEqualToValue={(option, value) => option.id_empleado === value?.id_empleado}
//                 onInputChange={(event, newInputValue) => buscarEmpleados(newInputValue)}
//                 onChange={(event, newValue) => {
//                   setEmpleadoSeleccionado(newValue);
//                   setForm(prev => ({ ...prev, id_empleado: newValue?.id_empleado || "" }));
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Empleado"
//                     required
//                     helperText="Buscar por número de empleado, DPI o nombre"
//                   />
//                 )}
//               />
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
//===================================================================================================================
import { useState } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Grid, Paper,
  Alert, CircularProgress, Divider, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function CrearPermiso() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    id_empleado: "",
    motivo: "",
    fecha_requerida: "",
    dias_solicitados: 1,
    documento: null,
    autorizado_por: '',
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
      setEmpleado(response.data);
      setForm(prev => ({ ...prev, id_empleado: response.data.id_empleado }));
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
    if (!form.motivo) { setError("Debe escribir el motivo"); return; }
    
    const data = new FormData();
    data.append("id_empleado", form.id_empleado);
    data.append("motivo", form.motivo);
    data.append("fecha_requerida", form.fecha_requerida);
    data.append("dias_solicitados", form.dias_solicitados);
    data.append("autorizado_por", form.autorizado_por);
    if (form.documento) data.append("documento", form.documento);

    try {
      await axios.post("http://127.0.0.1:8000/api/permisos/", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      navigate("/dashboard/permisos");
    } catch (err) {
      setError("Error al enviar la solicitud");
    }
  };

  return (
  <Box
    sx={{
      p: { xs: 2, md: 4 },
      display: "flex",
      justifyContent: "center",
      bgcolor: "#eef2f7",
      minHeight: "100vh",
    }}
  >
    <Paper sx={{ p: 4, width: "100%", maxWidth: 900, borderRadius: 3 }}>
      
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Solicitud de Permiso
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
              {getNombreCompleto(empleado.persona_detalle)} - {empleado.persona_detalle?.dpi}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Paper>

    {/* Duracion de permiso */}
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Duración del permiso
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="date"
            name="fecha_requerida"
            label="Fecha de inicio"
            value={form.fecha_requerida}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="number"
            name="dias_solicitados"
            label="Cantidad de días"
            value={form.dias_solicitados}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="autorizado_por"
            label="Nombre de quien autoriza"
            value={form.autorizado_por || ""}
            onChange={handleChange}
            size="small"
            placeholder="Ej: Lic. Ana Pérez"
          />
        </Grid>

      </Grid>
    </Paper>

    {/* Motivo permiso*/}
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Justificación
      </Typography>

      <TextField
        fullWidth
        required
        multiline
        rows={5}
        name="motivo"
        label="Motivo del permiso"
        placeholder="Describa el motivo del permiso..."
        value={form.motivo}
        onChange={handleChange}
      />
    </Paper>

    {/* Up Documento*/}
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
      textAlign: "center",
      cursor: "pointer",
      transition: "0.2s",
      
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,

      minHeight: "120px",

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
      onChange={(e) =>
        setForm({ ...form, documento: e.target.files[0] })
      }
    />
  </Box>
</Paper>

    {/* Botones*/}
    <Box display="flex" justifyContent="flex-end" gap={2}>
      <Button
        variant="outlined"
        onClick={() => navigate("/dashboard/permisos")}
      >
        Cancelar
      </Button>

      <Button type="submit" variant="contained">
        Registrar permiso
      </Button>
    </Box>

  </Stack>
</form>
    </Paper>
  </Box>
);
}