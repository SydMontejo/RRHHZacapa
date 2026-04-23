import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Box, Typography, Chip, IconButton, Tab, Tabs,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, CircularProgress, Paper
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ListarVacaciones() {
  const [tab, setTab] = useState(0);
  const [pendientes, setPendientes] = useState([]);
  const [revisados, setRevisados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVacacion, setSelectedVacacion] = useState(null);
  const [accion, setAccion] = useState(""); // APROBADO, RECHAZADO, MODIFICAR
  const [observaciones, setObservaciones] = useState("");
  const [nuevasFechas, setNuevasFechas] = useState({ fecha_inicio: "", fecha_fin: "" });
  const [error, setError] = useState("");
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/vacaciones/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Datos completos:", response.data);
      const todos = response.data;
      setPendientes(todos.filter(v => v.estado === "PENDIENTE"));
      setRevisados(todos.filter(v => v.estado === "APROBADO" || v.estado === "RECHAZADO"));
      
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAprobar = (row) => {
    setSelectedVacacion(row);
    setAccion("APROBADO");
    setObservaciones("");
    setOpenDialog(true);
  };

  const handleRechazar = (row) => {
    setSelectedVacacion(row);
    setAccion("RECHAZADO");
    setObservaciones("");
    setOpenDialog(true);
  };

  const handleModificar = (row) => {
    setSelectedVacacion(row);
    setAccion("MODIFICAR");
    setNuevasFechas({
      fecha_inicio: row.fecha_inicio,
      fecha_fin: row.fecha_fin
    });
    setOpenDialog(true);
  };

  const handleConfirmar = async () => {
    if (accion === "MODIFICAR") {
      try {
        await axios.put(
          `http://127.0.0.1:8000/api/vacaciones/${selectedVacacion.id_vacacion}/modificar_fechas/`,
          nuevasFechas,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOpenDialog(false);
        fetchData();
      } catch (err) {
        setError("Error al modificar fechas");
      }
    } else {
      try {
        await axios.patch(
          `http://127.0.0.1:8000/api/vacaciones/${selectedVacacion.id_vacacion}/`,
          {
            estado: accion,
            observaciones: observaciones,
            fecha_aprobacion: new Date().toISOString().split("T")[0]
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOpenDialog(false);
        fetchData();
      } catch (err) {
        setError("Error al actualizar la solicitud");
      }
    }
  };

  // Función para mostrar el estado dinámico (EN EJECUCIÓN si corresponde)
  const getEstadoDisplay = (vacacion) => {
    if (vacacion.estado === "APROBADO") {
      const hoy = new Date().toISOString().slice(0, 10);
      if (vacacion.fecha_inicio <= hoy && vacacion.fecha_fin >= hoy) {
        return "EN EJECUCIÓN";
      }
    }
    return vacacion.estado;
  };

  const columnsPendientes = [
    { field: "id_vacacion", headerName: "ID", width: 80 },
    { 
  field: "nombre_completo",
  headerName: "Empleado",
  width: 200,
  renderCell: (params) => {
    const nombre = params.row.empleado_nombre || '';
    const apellido = params.row.empleado_apellido || '';
    return `${nombre} ${apellido}`.trim() || 'Sin nombre';
  }
},
    { field: "fecha_inicio", headerName: "Inicio", width: 110 },
    { field: "fecha_fin", headerName: "Fin", width: 110 },
    {
      field: "documento_url",
      headerName: "Documento",
      width: 100,
      renderCell: (params) => params.value ? (
        <a href={params.value} target="_blank" rel="noopener noreferrer">Ver PDF</a>
      ) : "N/A"
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`/dashboard/vacaciones/${params.row.id_vacacion}`)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="success" onClick={() => handleAprobar(params.row)}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleRechazar(params.row)}>
            <CancelIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleModificar(params.row)}>
            <EditIcon />
          </IconButton>
        </>
      )
    }
  ];

  const columnsRevisados = [
    { field: "id_vacacion", headerName: "ID", width: 80 },
    { 
  field: "nombre_completo",
  headerName: "Empleado",
  width: 200,
  renderCell: (params) => {
    const nombre = params.row.empleado_nombre || '';
    const apellido = params.row.empleado_apellido || '';
    return `${nombre} ${apellido}`.trim() || 'Sin nombre';
  }
},
    { field: "fecha_inicio", headerName: "Inicio", width: 110 },
    { field: "fecha_fin", headerName: "Fin", width: 110 },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => {
        const estadoMostrado = getEstadoDisplay(params.row);
        let color = "default";
        if (estadoMostrado === "APROBADO") color = "success";
        else if (estadoMostrado === "RECHAZADO") color = "error";
        else if (estadoMostrado === "EN EJECUCIÓN") color = "info";
        return <Chip label={estadoMostrado} color={color} />;
      }
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 80,
      renderCell: (params) => (
        <IconButton onClick={() => navigate(`/dashboard/vacaciones/${params.row.id_vacacion}`)}>
          <VisibilityIcon />
        </IconButton>
      )
    }
  ];

  if (loading) return <CircularProgress />;

  return (
  <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4, px: 2 }}>

    <Paper sx={{ p: 3, borderRadius: 3 }}>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Vacaciones
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/dashboard/vacaciones/crear"
        >
          Solicitar vacaciones
        </Button>
      </Box>

      {/* Tabs */}
      <Paper variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          sx={{ px: 2 }}
        >
          <Tab label={`Pendientes (${pendientes.length})`} />
          <Tab label={`Revisados (${revisados.length})`} />
        </Tabs>
      </Paper>

      {/* Error */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Tabla */}
      <Box sx={{ height: 500 }}>
        {tab === 0 ? (
          <DataGrid
            rows={pendientes}
            columns={columnsPendientes}
            getRowId={(row) => row.id_vacacion}
            sx={{
              borderRadius: 2,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f1f5f9",
                fontWeight: "bold",
              },
            }}
          />
        ) : (
          <DataGrid
            rows={revisados}
            columns={columnsRevisados}
            getRowId={(row) => row.id_vacacion}
            sx={{
              borderRadius: 2,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f1f5f9",
                fontWeight: "bold",
              },
            }}
          />
        )}
      </Box>

    </Paper>

    {/* Dialogo */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
      
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {accion === "APROBADO" && "Aprobar solicitud de vacaciones"}
        {accion === "RECHAZADO" && "Rechazar solicitud de vacaciones"}
        {accion === "MODIFICAR" && "Modificar fechas de vacaciones"}
      </DialogTitle>

      <DialogContent dividers>
        {accion === "MODIFICAR" ? (
          <Stack spacing={2}>
            <TextField
              label="Nueva fecha inicio"
              type="date"
              fullWidth
              value={nuevasFechas.fecha_inicio}
              onChange={(e) =>
                setNuevasFechas({
                  ...nuevasFechas,
                  fecha_inicio: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Nueva fecha fin"
              type="date"
              fullWidth
              value={nuevasFechas.fecha_fin}
              onChange={(e) =>
                setNuevasFechas({
                  ...nuevasFechas,
                  fecha_fin: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        ) : (
          <TextField
            label="Observaciones (opcional)"
            fullWidth
            multiline
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>
          Cancelar
        </Button>

        <Button
          onClick={handleConfirmar}
          variant="contained"
          color={
            accion === "APROBADO"
              ? "success"
              : accion === "RECHAZADO"
              ? "error"
              : "primary"
          }
        >
          Confirmar
        </Button>
      </DialogActions>

    </Dialog>

  </Box>
);
}