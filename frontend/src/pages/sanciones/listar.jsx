import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box, Typography, IconButton, TextField, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, Paper, Stack
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ListarSanciones() {
  const [sanciones, setSanciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [openDetalle, setOpenDetalle] = useState(false);
  const [sancionSeleccionada, setSancionSeleccionada] = useState(null);
  const token = localStorage.getItem("access");

  const fetchSanciones = async () => {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/api/sanciones/";
      const params = new URLSearchParams();
      if (filtroNumero) params.append("search", filtroNumero);
      if (filtroFechaInicio) params.append("fecha_sancion__gte", filtroFechaInicio);
      if (filtroFechaFin) params.append("fecha_sancion__lte", filtroFechaFin);
      if (params.toString()) url += `?${params.toString()}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSanciones(response.data);
    } catch (err) {
      setError("Error al cargar sanciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSanciones();
  }, [filtroNumero, filtroFechaInicio, filtroFechaFin]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar esta sanción? (Eliminación lógica)")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/sanciones/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSanciones();
      } catch (err) {
        setError("Error al eliminar");
      }
    }
  };

  const handleVerDetalle = (row) => {
    setSancionSeleccionada(row);
    setOpenDetalle(true);
  };

  const columns = [
    { field: "id_sancion", headerName: "ID", width: 80 },
    { field: "empleado_nombre", headerName: "Empleado", width: 250 },
    { field: "fecha_sancion", headerName: "Fecha sanción", width: 130 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleVerDetalle(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEliminar(params.row.id_sancion)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
  <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4, px: 2 }}>

    <Paper sx={{ p: 3, borderRadius: 3 }}>
      
      {/* Header*/}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Sanciones
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/dashboard/sanciones/crear"
        >
          + Crear sanción
        </Button>
      </Box>

      {/* Filtros*/}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} mb={2}>
          Filtros
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <TextField
            label="Número de empleado"
            value={filtroNumero}
            onChange={(e) => setFiltroNumero(e.target.value)}
            size="small"
          />

          <TextField
            label="Fecha inicio"
            type="date"
            value={filtroFechaInicio}
            onChange={(e) => setFiltroFechaInicio(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Fecha fin"
            type="date"
            value={filtroFechaFin}
            onChange={(e) => setFiltroFechaFin(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="outlined"
            onClick={() => {
              setFiltroNumero("");
              setFiltroFechaInicio("");
              setFiltroFechaFin("");
            }}
          >
            Limpiar
          </Button>
        </Box>
      </Paper>

      {/* Error*/}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Grid*/}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={sanciones}
          columns={columns}
          getRowId={(row) => row.id_sancion}
          loading={loading}
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

    {/* Modal de Detalle*/}
    <Dialog
      open={openDetalle}
      onClose={() => setOpenDetalle(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Detalle de sanción
      </DialogTitle>

      <DialogContent dividers>
        {sancionSeleccionada && (
          <Stack spacing={1}>
            <Typography><strong>Empleado:</strong> {sancionSeleccionada.empleado_nombre}</Typography>
            <Typography><strong>Servicio:</strong> {sancionSeleccionada.empleado_servicio || "N/A"}</Typography>
            <Typography><strong>Ubicación:</strong> {sancionSeleccionada.empleado_ubicacion || "N/A"}</Typography>
            <Typography><strong>Fecha:</strong> {sancionSeleccionada.fecha_sancion}</Typography>
            <Typography><strong>Detalle:</strong> {sancionSeleccionada.detalle}</Typography>

            {sancionSeleccionada.documento_url && (
              <Button
                href={sancionSeleccionada.documento_url}
                target="_blank"
                variant="outlined"
                sx={{ mt: 1, width: "fit-content" }}
              >
                Ver documento
              </Button>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDetalle(false)}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>

  </Box>
);
}