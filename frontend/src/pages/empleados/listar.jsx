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

import { useEffect, useState } from "react";
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

  const [openModal, setOpenModal] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const token = localStorage.getItem("access");

  // ================= OBTENER DATA =================
  const obtenerData = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const emp = await axios.get("http://127.0.0.1:8000/api/empleados/", { headers });
    const ren = await axios.get("http://127.0.0.1:8000/api/renglones/", { headers });
    const ser = await axios.get("http://127.0.0.1:8000/api/servicios/", { headers });

    setEmpleados(emp.data);
    setRenglones(ren.data);
    setServicios(ser.data);
  };

  useEffect(() => {
    obtenerData();
  }, []);

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
      obtenerData();

    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al actualizar", "error");
    }
  };

  // ================= ELIMINAR =================
  const eliminarEmpleado = async (id) => {
    const confirmacion = window.confirm("¿Eliminar este empleado?");
    if (!confirmacion) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/empleados/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      mostrarMensaje("Empleado eliminado");
      obtenerData();

    } catch (error) {
      mostrarMensaje("Error al eliminar", "error");
    }
  };

  // ================= COLUMNAS =================
  const columnas = [
    { field: "id_empleado", headerName: "ID", width: 80 },
    { field: "persona_nombre", headerName: "Persona", width: 250 },
    { field: "numero_empleado", headerName: "No. Empleado", width: 150 },
    { field: "renglon_codigo", headerName: "Renglón", width: 120 },
    { field: "servicio_nombre", headerName: "Servicio", width: 150 },
    {
      field: "activo",
      headerName: "Activo",
      width: 100,
      renderCell: (p) => (p.value ? "Sí" : "No"),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => abrirModal(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton onClick={() => eliminarEmpleado(params.row.id_empleado)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Empleados</Typography>

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