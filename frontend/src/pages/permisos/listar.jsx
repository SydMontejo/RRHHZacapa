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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ListarPermisos() {
  const [tab, setTab] = useState(0);
  const [pendientes, setPendientes] = useState([]);
  const [revisados, setRevisados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [accion, setAccion] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/api/permisos/";
      if (searchTerm.trim() !== "") {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const todos = response.data;
      setPendientes(todos.filter(p => p.estado === "PENDIENTE"));
      setRevisados(todos.filter(p => p.estado === "APROBADO" || p.estado === "RECHAZADO"));
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  // setLoading(true);
  // try {
  //   const response = await axios.get("http://127.0.0.1:8000/api/permisos/", {
  //     headers: { Authorization: `Bearer ${token}` }
  //   });
  //   const todos = response.data;
  //   setPendientes(todos.filter(p => p.estado === "PENDIENTE"));
  //   setRevisados(todos.filter(p => p.estado === "APROBADO" || p.estado === "RECHAZADO"));
  // } catch (err) {
  //   setError("Error al cargar los datos");
  // } finally {
  //   setLoading(false);
  // }
};

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500); // espera 500 ms después de la última pulsación

    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const handleAprobar = (row) => {
    setSelectedPermiso(row);
    setAccion("APROBADO");
    setObservaciones("");
    setOpenDialog(true);
  };

  const handleRechazar = (row) => {
    setSelectedPermiso(row);
    setAccion("RECHAZADO");
    setObservaciones("");
    setOpenDialog(true);
  };

  const handleConfirmar = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/permisos/${selectedPermiso.id_permiso}/`,
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
      setError("Error al actualizar el permiso");
    }
  };

  const columnsPendientes = [
    //{ field: "id_permiso", headerName: "ID", width: 80 },
    { field: "empleado_nombre_completo", headerName: "Empleado", width: 400 },
    { field: "motivo", headerName: "Motivo", width: 250 },
    { field: "fecha_solicitud", headerName: "Solicitud", width: 110 },
    { field: "fecha_requerida", headerName: "Requerida", width: 110 },
    { field: "dias_solicitados", headerName: "Días", width: 80, type: "number" },
    {
      field: "documento_url",
      headerName: "Documento",
      width: 100,
      renderCell: (params) => params.value ? (
        <a href={params.value} target="_blank" rel="noopener noreferrer">Ver PDF</a>
      ) : "N/A"
    },
    { field: "autorizado_por", headerName: "Autorizado por", width: 200 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`/dashboard/permisos/${params.row.id_permiso}`)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="success" onClick={() => handleAprobar(params.row)}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleRechazar(params.row)}>
            <CancelIcon />
          </IconButton>
        </>
      )
    }
  ];

  const columnsRevisados = [
    //{ field: "id_permiso", headerName: "ID", width: 80 },
    { field: "empleado_nombre_completo", headerName: "Empleado", width: 400 },
    { field: "motivo", headerName: "Motivo", width: 250 },
    { field: "fecha_solicitud", headerName: "Solicitud", width: 110 },
    { field: "fecha_requerida", headerName: "Requerida", width: 110 },
    { field: "dias_solicitados", headerName: "Días", width: 80, type: "number" },
    {
      field: "documento_url",
      headerName: "Documento",
      width: 100,
      renderCell: (params) => params.value ? (
        <a href={params.value} target="_blank" rel="noopener noreferrer">Ver PDF</a>
      ) : "N/A"
    },
    { field: "autorizado_por", headerName: "Autorizado por", width: 200 },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === "APROBADO" ? "success" : "error"} />
      )
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 80,
      renderCell: (params) => (
        <IconButton onClick={() => navigate(`/dashboard/permisos/${params.row.id_permiso}`)}>
          <VisibilityIcon />
        </IconButton>
      )
    }
  ];

  if (loading) return <CircularProgress />;

  return (
  <Box sx={{ p: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
    
    {/* Header */}
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" fontWeight="bold">
        Permisos
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Gestión y aprobación de permisos laborales
      </Typography>
    </Box>

    {/* Filtros y acciones */}
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          label="Buscar por número de empleado"
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          sx={{ minWidth: 280 }}
        />

        <Button
          variant="contained"
          component={Link}
          to="/dashboard/permisos/crear"
        >
          Crear Permiso
        </Button>
      </Box>
    </Paper>

    {/* Tabs */}
    <Paper sx={{ mb: 3, borderRadius: 2 }}>
      <Tabs
        value={tab}
        onChange={(e, newVal) => setTab(newVal)}
        variant="fullWidth"
      >
        <Tab label={`Pendientes (${pendientes.length})`} />
        <Tab label={`Revisados (${revisados.length})`} />
      </Tabs>
    </Paper>

    {/* Error */}
    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    {/* Tabla */}
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: 500, width: "100%" }}>
        {tab === 0 ? (
          <DataGrid
            rows={pendientes}
            columns={columnsPendientes}
            getRowId={(row) => row.id_permiso}
            disableRowSelectionOnClick
            sx={{
              border: "none",
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
            getRowId={(row) => row.id_permiso}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f1f5f9",
                fontWeight: "bold",
              },
            }}
          />
        )}
      </div>
    </Paper>

    {/* Dialog */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {accion === "APROBADO" ? "Aprobar permiso" : "Rechazar permiso"}
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="Observaciones (opcional)"
          fullWidth
          multiline
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setOpenDialog(false)}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirmar}
          variant="contained"
          color={accion === "APROBADO" ? "success" : "error"}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
}