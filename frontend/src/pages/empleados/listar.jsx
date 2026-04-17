// import { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";
// import { Box, Typography } from "@mui/material";

// export default function ListarEmpleados() {
//   const [empleados, setEmpleados] = useState([]);
//   const token = localStorage.getItem("access");

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/api/empleados/", {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then(res => setEmpleados(res.data));
//   }, []);

//   const columnas = [
//     { field: "id_empleado", headerName: "ID", width: 80 },
//     { field: "persona_nombre", headerName: "Persona", width: 250 },
//     { field: "numero_empleado", headerName: "No. Empleado", width: 150 },
//     { field: "renglon_codigo", headerName: "Renglón", width: 120 },
//     { field: "servicio_nombre", headerName: "Servicio", width: 150 },
//     {
//       field: "activo",
//       headerName: "Activo",
//       width: 100,
//       renderCell: (p) => (p.value ? "Sí" : "No"),
//     },
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5">Empleados</Typography>

//       <div style={{ height: 500 }}>
//         <DataGrid
//           rows={empleados}
//           columns={columnas}
//           getRowId={(row) => row.id_empleado}
//         />
//       </div>
//     </Box>
//   );
// }
//===================================================================================================
// import { useEffect, useState } from "react";
// import VisibilityIcon from '@mui/icons-material/Visibility'
// import {
//   Box,
//   Typography,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Snackbar,
//   Alert,
//   MenuItem,
//   Switch,
//   FormControlLabel
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";

// export default function ListarEmpleados() {

//   const [empleados, setEmpleados] = useState([]);
//   const [renglones, setRenglones] = useState([]);
//   const [servicios, setServicios] = useState([]);

//   const [openModal, setOpenModal] = useState(false);
//   const [empleadoEdit, setEmpleadoEdit] = useState(null);
//   const [openDetalleModal, setOpenDetalleModal] = useState(false);
//   const [empleadoDetalle, setEmpleadoDetalle] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   const token = localStorage.getItem("access");

//   // ================= OBTENER DATA =================
//   const obtenerData = async () => {
//     const headers = { Authorization: `Bearer ${token}` };

//     const emp = await axios.get("http://127.0.0.1:8000/api/empleados/", { headers });
//     const ren = await axios.get("http://127.0.0.1:8000/api/renglones/", { headers });
//     const ser = await axios.get("http://127.0.0.1:8000/api/servicios/", { headers });

//     setEmpleados(emp.data);
//     setRenglones(ren.data);
//     setServicios(ser.data);
//   };

//   useEffect(() => {
//     obtenerData();
//   }, []);

//   // ================= SNACKBAR =================
//   const mostrarMensaje = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   // ================= EDITAR =================
//   const abrirModal = (row) => {
//     setEmpleadoEdit({
//       ...row,
//       id_renglon: row.id_renglon || "",
//       id_servicio: row.id_servicio || "",
//     });
//     setOpenModal(true);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setEmpleadoEdit({
//       ...empleadoEdit,
//       [name]: type === "checkbox" ? checked : value
//     });
//   };

//   const guardarCambios = async () => {
//     try {
//       await axios.put(
//         `http://127.0.0.1:8000/api/empleados/${empleadoEdit.id_empleado}/`,
//         {
//           numero_empleado: empleadoEdit.numero_empleado,
//           id_persona: empleadoEdit.id_persona,
//           id_renglon: empleadoEdit.id_renglon,
//           id_servicio: empleadoEdit.id_servicio,
//           fecha_contratacion: empleadoEdit.fecha_contratacion,
//           puesto_oficial: empleadoEdit.puesto_oficial,
//           ubicacion_fisica: empleadoEdit.ubicacion_fisica,
//           comisionado_seccion_nombre: empleadoEdit.comisionado_seccion_nombre,
//           comisionado_seccion_numero: empleadoEdit.comisionado_seccion_numero,
//           activo: empleadoEdit.activo,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       mostrarMensaje("Empleado actualizado");
//       setOpenModal(false);
//       obtenerData();

//     } catch (error) {
//       console.error(error);
//       mostrarMensaje("Error al actualizar", "error");
//     }
//   };

//   // ================= ELIMINAR =================
//   const eliminarEmpleado = async (id) => {
//     const confirmacion = window.confirm("¿Eliminar este empleado?");
//     if (!confirmacion) return;

//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/empleados/${id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       mostrarMensaje("Empleado eliminado");
//       obtenerData();

//     } catch (error) {
//       mostrarMensaje("Error al eliminar", "error");
//     }
//   };

//   const verDetalle = (row) => {
//     setEmpleadoDetalle(row);
//     setOpenDetalleModal(true);
//   };

//   // ================= COLUMNAS =================
//   const columnas = [
//     { field: "id_empleado", headerName: "ID", width: 80 },
//     { field: "persona_nombre", headerName: "Persona", width: 250 },
//     { field: "numero_empleado", headerName: "No. Empleado", width: 150 },
//     { field: "renglon_codigo", headerName: "Renglón", width: 120 },
//     { field: "servicio_nombre", headerName: "Servicio", width: 150 },
//     {
//       field: "activo",
//       headerName: "Activo",
//       width: 100,
//       renderCell: (p) => (p.value ? "Sí" : "No"),
//     },
//     {
//       field: "acciones",
//       headerName: "Acciones",
//       width: 180,
//       renderCell: (params) => (
//         <>
//           <IconButton onClick={() => verDetalle(params.row)}>
//             <VisibilityIcon />
//           </IconButton>
//           <IconButton onClick={() => abrirModal(params.row)}>
//             <EditIcon />
//           </IconButton>

//           <IconButton onClick={() => eliminarEmpleado(params.row.id_empleado)}>
//             <DeleteIcon color="error" />
//           </IconButton>
//         </>
//       )
//     }
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5">Empleados</Typography>

//       <div style={{ height: 500 }}>
//         <DataGrid
//           rows={empleados}
//           columns={columnas}
//           getRowId={(row) => row.id_empleado}
//         />
//       </div>

//       {/* ================= MODAL EDITAR ================= */}
//       <Dialog open={openModal} onClose={() => setOpenModal(false)}>
//         <DialogTitle>Editar Empleado</DialogTitle>

//         <DialogContent>

//           <TextField
//             select
//             label="Renglón"
//             name="id_renglon"
//             value={empleadoEdit?.id_renglon || ""}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           >
//             <MenuItem value="">Seleccione</MenuItem>
//             {renglones.map(r => (
//               <MenuItem key={r.id_renglon} value={r.id_renglon}>
//                 {r.codigo}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             select
//             label="Servicio"
//             name="id_servicio"
//             value={empleadoEdit?.id_servicio || ""}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           >
//             <MenuItem value="">Seleccione</MenuItem>
//             {servicios.map(s => (
//               <MenuItem key={s.id_servicio} value={s.id_servicio}>
//                 {s.nombre}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             label="Puesto Oficial"
//             name="puesto_oficial"
//             value={empleadoEdit?.puesto_oficial || ""}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />

//           <TextField
//             label="Ubicación Física"
//             name="ubicacion_fisica"
//             value={empleadoEdit?.ubicacion_fisica || ""}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />

//           <TextField
//             label="Comisionado Sección Número"
//             name="comisionado_seccion_numero"
//             value={empleadoEdit?.comisionado_seccion_numero || ""}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />

//           <TextField
//             label="Comisionado Sección Nombre"
//             name="comisionado_seccion_nombre"
//             value={empleadoEdit?.comisionado_seccion_nombre || ""}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />

//           <FormControlLabel
//             control={
//               <Switch
//                 checked={empleadoEdit?.activo || false}
//                 onChange={handleChange}
//                 name="activo"
//               />
//             }
//             label="Activo"
//           />

//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
//           <Button variant="contained" onClick={guardarCambios}>
//             Guardar
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ================= MODAL DETALLES ================= */}
// <Dialog open={openDetalleModal} onClose={() => setOpenDetalleModal(false)} maxWidth="md" fullWidth>
//   <DialogTitle>Detalles del Empleado</DialogTitle>
//   <DialogContent dividers>
//     {empleadoDetalle && (
//       <Box sx={{ display: 'flex', gap: 3 }}>
//         {/* Columna izquierda: foto */}
//         <Box sx={{ width: 200, textAlign: 'center' }}>
//           {empleadoDetalle.foto_persona ? (
//             <img
//               src={empleadoDetalle.foto_persona}
//               alt="Foto del empleado"
//               style={{
//                 width: '100%',
//                 maxHeight: 200,
//                 objectFit: 'cover',
//                 borderRadius: 8,
//                 border: '1px solid #ccc'
//               }}
//             />
//           ) : (
//             <Box sx={{
//               width: '100%',
//               height: 150,
//               bgcolor: '#f5f5f5',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               borderRadius: 2,
//               color: '#666'
//             }}>
//               Sin foto
//             </Box>
//           )}
//         </Box>

//         {/* Columna derecha: datos laborales y de persona */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h6">Información laboral</Typography>
//           <Typography><strong>Número de empleado:</strong> {empleadoDetalle.numero_empleado}</Typography>
//           <Typography><strong>Persona:</strong> {empleadoDetalle.persona_nombre}</Typography>
//           <Typography><strong>Renglón:</strong> {empleadoDetalle.renglon_codigo}</Typography>
//           <Typography><strong>Servicio:</strong> {empleadoDetalle.servicio_nombre}</Typography>
//           <Typography><strong>Puesto oficial:</strong> {empleadoDetalle.puesto_oficial || 'N/A'}</Typography>
//           <Typography><strong>Ubicación física:</strong> {empleadoDetalle.ubicacion_fisica || 'N/A'}</Typography>
//           <Typography><strong>Comisionado sección número:</strong> {empleadoDetalle.comisionado_seccion_numero || 'N/A'}</Typography>
//           <Typography><strong>Comisionado sección nombre:</strong> {empleadoDetalle.comisionado_seccion_nombre || 'N/A'}</Typography>
//           <Typography><strong>Fecha contratación:</strong> {empleadoDetalle.fecha_contratacion || 'N/A'}</Typography>
//           <Typography><strong>Activo:</strong> {empleadoDetalle.activo ? 'Sí' : 'No'}</Typography>

//           <Typography variant="h6" sx={{ mt: 2 }}>Datos de la persona</Typography>
//           <Typography><strong>Nombre completo:</strong> {empleadoDetalle.persona_nombre}</Typography>
//           <Typography><strong>DPI:</strong> {empleadoDetalle.id_persona?.dpi || 'N/A'}</Typography>
//           <Typography><strong>Correo:</strong> {empleadoDetalle.id_persona?.correo || 'N/A'}</Typography>
//           <Typography><strong>Teléfono:</strong> {empleadoDetalle.id_persona?.telefono || 'N/A'}</Typography>
//           <Typography><strong>Dirección:</strong> {empleadoDetalle.id_persona?.direccion || 'N/A'}</Typography>
//         </Box>
//       </Box>
//     )}
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setOpenDetalleModal(false)}>Cerrar</Button>
//   </DialogActions>
// </Dialog>

//       {/* ================= SNACKBAR ================= */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//     </Box>
//   );
// }
//====================================================================================
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Switch,
  FormControlLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function ListarEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [renglones, setRenglones] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // estado para búsqueda

  const [openModal, setOpenModal] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);
  const [openDetalleModal, setOpenDetalleModal] = useState(false);
  const [empleadoDetalle, setEmpleadoDetalle] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const token = localStorage.getItem("access");

  // ================= CARGAR DATOS (con búsqueda opcional) =================
  const cargarDatos = async (textoBusqueda = "") => {
    const headers = { Authorization: `Bearer ${token}` };
    let urlEmpleados = "http://127.0.0.1:8000/api/empleados/";
    if (textoBusqueda.trim() !== "") {
      urlEmpleados += `?search=${encodeURIComponent(textoBusqueda)}`;
    }
    try {
      const [emp, ren, ser] = await Promise.all([
        axios.get(urlEmpleados, { headers }),
        axios.get("http://127.0.0.1:8000/api/renglones/", { headers }),
        axios.get("http://127.0.0.1:8000/api/servicios/", { headers }),
      ]);
      setEmpleados(emp.data);
      setRenglones(ren.data);
      setServicios(ser.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos(); // carga inicial sin búsqueda
  }, []);

  // Manejar búsqueda en tiempo real
  const handleBusqueda = (e) => {
    const texto = e.target.value;
    setBusqueda(texto);
    cargarDatos(texto);
  };

  // ================= SNACKBAR =================
  const mostrarMensaje = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ================= EDITAR =================
  const abrirModal = (row) => {
    setEmpleadoEdit({
      ...row,
      id_renglon: row.id_renglon || "",
      id_servicio: row.id_servicio || "",
    });
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmpleadoEdit({
      ...empleadoEdit,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const guardarCambios = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/empleados/${empleadoEdit.id_empleado}/`,
        {
          numero_empleado: empleadoEdit.numero_empleado,
          id_persona: empleadoEdit.id_persona,
          id_renglon: empleadoEdit.id_renglon,
          id_servicio: empleadoEdit.id_servicio,
          fecha_contratacion: empleadoEdit.fecha_contratacion,
          puesto_oficial: empleadoEdit.puesto_oficial,
          ubicacion_fisica: empleadoEdit.ubicacion_fisica,
          comisionado_seccion_nombre: empleadoEdit.comisionado_seccion_nombre,
          comisionado_seccion_numero: empleadoEdit.comisionado_seccion_numero,
          activo: empleadoEdit.activo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje("Empleado actualizado");
      setOpenModal(false);
      cargarDatos(busqueda); // refrescar manteniendo búsqueda
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al actualizar", "error");
    }
  };

  // ================= ELIMINAR =================
  const eliminarEmpleado = async (id) => {
    if (!window.confirm("¿Eliminar este empleado?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/empleados/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mostrarMensaje("Empleado eliminado");
      cargarDatos(busqueda);
    } catch (error) {
      mostrarMensaje("Error al eliminar", "error");
    }
  };

  // ================= VER DETALLE =================
  const verDetalle = (row) => {
    setEmpleadoDetalle(row);
    setOpenDetalleModal(true);
  };

  // ================= COLUMNAS =================
  const columnas = [
    { field: "id_empleado", headerName: "ID", width: 80 },
    { field: "persona_nombre", headerName: "Persona", width: 250 },
    { field: "numero_empleado", headerName: "No. Empleado", width: 150 },
    { field: "renglon_codigo", headerName: "Renglón", width: 120 },
    { field: "servicio_nombre", headerName: "Servicio", width: 150 },
    { field: "ubicacion_fisica", headerName: "Ubicación física", width: 200 },
    {
      field: "activo",
      headerName: "Activo",
      width: 100,
      renderCell: (p) => (p.value ? "Sí" : "No"),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 130,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => verDetalle(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => abrirModal(params.row)}>
            <EditIcon />
          </IconButton>
          {/* <IconButton onClick={() => eliminarEmpleado(params.row.id_empleado)}>
            <DeleteIcon color="error" />
          </IconButton> */}
        </>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Empleados</Typography>

      {/* BUSCADOR */}
      <TextField
        label="Buscar empleado (nombre, DPI, número de empleado)"
        fullWidth
        sx={{ mb: 2 }}
        value={busqueda}
        onChange={handleBusqueda}
      />

      <div style={{ height: 500 }}>
        <DataGrid
          rows={empleados}
          columns={columnas}
          getRowId={(row) => row.id_empleado}
        />
      </div>

      {/* ================= MODAL EDITAR ================= */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Editar Empleado</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Renglón"
            name="id_renglon"
            value={empleadoEdit?.id_renglon || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Seleccione</MenuItem>
            {renglones.map(r => (
              <MenuItem key={r.id_renglon} value={r.id_renglon}>
                {r.codigo}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Servicio"
            name="id_servicio"
            value={empleadoEdit?.id_servicio || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Seleccione</MenuItem>
            {servicios.map(s => (
              <MenuItem key={s.id_servicio} value={s.id_servicio}>
                {s.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Puesto Oficial"
            name="puesto_oficial"
            value={empleadoEdit?.puesto_oficial || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Ubicación Física"
            name="ubicacion_fisica"
            value={empleadoEdit?.ubicacion_fisica || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Comisionado Sección Número"
            name="comisionado_seccion_numero"
            value={empleadoEdit?.comisionado_seccion_numero || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Comisionado Sección Nombre"
            name="comisionado_seccion_nombre"
            value={empleadoEdit?.comisionado_seccion_nombre || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <FormControlLabel
            control={
              <Switch
                checked={empleadoEdit?.activo || false}
                onChange={handleChange}
                name="activo"
              />
            }
            label="Activo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarCambios}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= MODAL DETALLE ================= */}
      <Dialog open={openDetalleModal} onClose={() => setOpenDetalleModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Empleado</DialogTitle>
        <DialogContent dividers>
          {empleadoDetalle && (
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/*foto */}
              <Box sx={{ width: 200, textAlign: 'center' }}>
                {empleadoDetalle.foto_persona ? (
                  <img
                    src={empleadoDetalle.foto_persona}
                    alt="Foto del empleado"
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #ccc'
                    }}
                  />
                ) : (
                  <Box sx={{
                    width: '100%',
                    height: 150,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    color: '#666'
                  }}>
                    Sin foto
                  </Box>
                )}
              </Box>

              {/* Columna derecha: datos laborales y de persona */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Información laboral</Typography>
                <Typography><strong>Número de empleado:</strong> {empleadoDetalle.numero_empleado}</Typography>
                <Typography><strong>Persona:</strong> {empleadoDetalle.persona_nombre}</Typography>
                <Typography><strong>Renglón:</strong> {empleadoDetalle.renglon_codigo}</Typography>
                <Typography><strong>Servicio:</strong> {empleadoDetalle.servicio_nombre}</Typography>
                <Typography><strong>Puesto oficial:</strong> {empleadoDetalle.puesto_oficial || 'N/A'}</Typography>
                <Typography><strong>Ubicación física:</strong> {empleadoDetalle.ubicacion_fisica || 'N/A'}</Typography>
                <Typography><strong>Comisionado sección número:</strong> {empleadoDetalle.comisionado_seccion_numero || 'N/A'}</Typography>
                <Typography><strong>Comisionado sección nombre:</strong> {empleadoDetalle.comisionado_seccion_nombre || 'N/A'}</Typography>
                <Typography><strong>Fecha contratación:</strong> {empleadoDetalle.fecha_contratacion || 'N/A'}</Typography>
                <Typography><strong>Activo:</strong> {empleadoDetalle.activo ? 'Sí' : 'No'}</Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>Datos de la persona</Typography>
                <Typography><strong>Nombre completo:</strong> {empleadoDetalle.persona_nombre}</Typography>
                <Typography><strong>DPI:</strong> {empleadoDetalle.persona_detalle?.dpi || 'N/A'}</Typography>
                <Typography><strong>Correo:</strong> {empleadoDetalle.persona_detalle?.correo || 'N/A'}</Typography>
                <Typography><strong>Teléfono:</strong> {empleadoDetalle.persona_detalle?.telefono || 'N/A'}</Typography>
                <Typography><strong>Dirección:</strong> {empleadoDetalle.persona_detalle?.direccion || 'N/A'}</Typography>
                <Typography><strong>Departamento:</strong> {empleadoDetalle.persona_detalle?.departamento || 'N/A'}</Typography>
                <Typography><strong>Municipio:</strong> {empleadoDetalle.persona_detalle?.municipio || 'N/A'}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetalleModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* ================= SNACKBAR ================= */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}