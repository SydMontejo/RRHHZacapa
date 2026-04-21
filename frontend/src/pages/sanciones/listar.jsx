import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box, Typography, IconButton, TextField, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Sanciones</Typography>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
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
        <Button variant="outlined" onClick={() => {
          setFiltroNumero("");
          setFiltroFechaInicio("");
          setFiltroFechaFin("");
        }}>
          Limpiar
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <div style={{ height: 500 }}>
        <DataGrid
          rows={sanciones}
          columns={columns}
          getRowId={(row) => row.id_sancion}
          loading={loading}
        />
      </div>

      {/* Modal de detalle */}
      <Dialog open={openDetalle} onClose={() => setOpenDetalle(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalle de Sanción</DialogTitle>
        <DialogContent dividers>
          {sancionSeleccionada && (
            <Box>
              <Typography><strong>Empleado:</strong> {sancionSeleccionada.empleado_nombre}</Typography>
              <Typography><strong>Servicio:</strong> {sancionSeleccionada.empleado_servicio || "N/A"}</Typography>
              <Typography><strong>Ubicación física:</strong> {sancionSeleccionada.empleado_ubicacion || "N/A"}</Typography>
              <Typography><strong>Fecha sanción:</strong> {sancionSeleccionada.fecha_sancion}</Typography>
              <Typography><strong>Detalle:</strong> {sancionSeleccionada.detalle}</Typography>
              {sancionSeleccionada.documento_url && (
                <Typography>
                  <a href={sancionSeleccionada.documento_url} target="_blank" rel="noreferrer">
                    Ver documento adjunto
                  </a>
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetalle(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}