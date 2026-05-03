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
  FormControlLabel, Paper, Stack, InputAdornment
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Link } from "react-router-dom";

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
  try {
    let empleadosData = [];
    const esNumero = /^\d+$/.test(textoBusqueda.trim());
    // Si es número y tiene entre 1 y 6 dígitos asumimos número de empleado
    if (esNumero && textoBusqueda.trim().length <= 6) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/empleados/por_numero/?numero=${textoBusqueda}`,
          { headers }
        );
        empleadosData = response.data ? [response.data] : [];
      } catch (err) {
        empleadosData = [];
      }
    } else {
      // Búsqueda normal (DPI, nombre, etc.)
      let urlEmpleados = "http://127.0.0.1:8000/api/empleados/";
      if (textoBusqueda.trim() !== "") {
        urlEmpleados += `?search=${encodeURIComponent(textoBusqueda)}`;
      }
      const emp = await axios.get(urlEmpleados, { headers });
      empleadosData = emp.data;
    }
    // Cargar renglones y servicios
    const [ren, ser] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/renglones/", { headers }),
      axios.get("http://127.0.0.1:8000/api/servicios/", { headers }),
    ]);
    setEmpleados(empleadosData);
    setRenglones(ren.data);
    setServicios(ser.data);
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
};

  useEffect(() => {
    cargarDatos(); // carga inicial sin búsqueda
  }, []);

  // Maneja búsqueda en tiempo real
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
          salario: empleadoEdit.salario,
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
    //{ field: "dpi_persona", headerName: "ID", width: 80 },
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
      field: "salario",
      headerName: "Salario (Q)",
      width: 120,
      renderCell: (params) => {
        const value = parseFloat(params.row.salario);
        if (isNaN(value)) return "N/A";

        return new Intl.NumberFormat("es-GT", {
          style: "currency",
          currency: "GTQ"
        }).format(value);
        }
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
  <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>

    <Paper sx={{ p: 3, borderRadius: 3 }}>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Empleados
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/dashboard/empleados/crear"
        >
          + Crear empleado
        </Button>
      </Box>

      {/* Busqueda */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          label="Buscar empleado (nombre, DPI, número de empleado)"
          fullWidth
          size="small"
          value={busqueda}
          onChange={handleBusqueda}
        />
      </Paper>

      {/* Tabla */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={empleados}
          columns={columnas}
          getRowId={(row) => row.id_empleado}
          sx={{
            borderRadius: 2,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f1f5f9",
              fontWeight: "bold",
            },
          }}
        />
      </Box>

    </Paper>

    {/* Modal editar */}
    <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
      
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Editar empleado
      </DialogTitle>

      <DialogContent dividers>

        <Stack spacing={2}>

          <TextField
            select
            label="Renglón"
            name="id_renglon"
            value={empleadoEdit?.id_renglon || ""}
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

          <TextField
            select
            label="Servicio"
            name="id_servicio"
            value={empleadoEdit?.id_servicio || ""}
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

          <TextField
            label="Puesto oficial"
            name="puesto_oficial"
            value={empleadoEdit?.puesto_oficial || ""}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          <TextField
            label="Ubicación física"
            name="ubicacion_fisica"
            value={empleadoEdit?.ubicacion_fisica || ""}
            onChange={handleChange}
            fullWidth
            size="small"
            multiline
            rows={2}
          />

          <TextField
            label="Sección número"
            name="comisionado_seccion_numero"
            value={empleadoEdit?.comisionado_seccion_numero || ""}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          <TextField
            label="Sección nombre"
            name="comisionado_seccion_nombre"
            value={empleadoEdit?.comisionado_seccion_nombre || ""}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          <TextField
            label="Salario (Q)"
            name="salario"
            type="number"
            step="0.01"
            value={empleadoEdit?.salario ?? ""}
            onChange={handleChange}
            fullWidth
            size="small"
            InputProps={{ startAdornment: <InputAdornment position="start">Q</InputAdornment> }}
          />

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
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
          </Paper>

        </Stack>

      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenModal(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={guardarCambios}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>

    {/* Modal detalle */}
    <Dialog open={openDetalleModal} onClose={() => setOpenDetalleModal(false)} maxWidth="md" fullWidth>
      
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Detalles del empleado
      </DialogTitle>

      <DialogContent dividers>
        {empleadoDetalle && (
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>

            {/* Foto */}
            <Paper sx={{ p: 2, width: 220, textAlign: "center", borderRadius: 2 }}>
              {empleadoDetalle.foto_persona ? (
                <img
                  src={empleadoDetalle.foto_persona}
                  alt="Foto"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  Sin foto
                </Box>
              )}
            </Paper>

            {/* Informacion */}
            <Box sx={{ flex: 1 }}>

              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Información laboral
                </Typography>

                <Typography><strong>Número:</strong> {empleadoDetalle.numero_empleado}</Typography>
                <Typography><strong>Renglón:</strong> {empleadoDetalle.renglon_codigo}</Typography>
                <Typography><strong>Servicio:</strong> {empleadoDetalle.servicio_nombre}</Typography>
                <Typography><strong>Puesto:</strong> {empleadoDetalle.puesto_oficial || 'N/A'}</Typography>
                <Typography><strong>Ubicación:</strong> {empleadoDetalle.ubicacion_fisica || 'N/A'}</Typography>
                <Typography><strong>Fecha:</strong> {empleadoDetalle.fecha_contratacion || 'N/A'}</Typography>
                <Typography><strong>Activo:</strong> {empleadoDetalle.activo ? 'Sí' : 'No'}</Typography>
                <Typography><strong>Salario:</strong> {empleadoDetalle.salario && !isNaN (parseFloat(empleadoDetalle.salario)) ? `Q ${parseFloat(empleadoDetalle.salario).toFixed(2)}` : 'N/A'}</Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Datos personales
                </Typography>

                <Typography><strong>Nombre:</strong> {empleadoDetalle.persona_nombre}</Typography>
                <Typography><strong>DPI:</strong> {empleadoDetalle.persona_detalle?.dpi || 'N/A'}</Typography>
                <Typography><strong>Correo:</strong> {empleadoDetalle.persona_detalle?.correo || 'N/A'}</Typography>
                <Typography><strong>Teléfono:</strong> {empleadoDetalle.persona_detalle?.telefono || 'N/A'}</Typography>
                <Typography><strong>Dirección:</strong> {empleadoDetalle.persona_detalle?.direccion || 'N/A'}</Typography>
                <Typography><strong>Departamento:</strong> {empleadoDetalle.persona_detalle?.departamento || 'N/A'}</Typography>
                <Typography><strong>Municipio:</strong> {empleadoDetalle.persona_detalle?.municipio || 'N/A'}</Typography>
              </Paper>

            </Box>

          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDetalleModal(false)}>
          Cerrar
        </Button>
      </DialogActions>

    </Dialog>

    {/* Snackbar */}
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