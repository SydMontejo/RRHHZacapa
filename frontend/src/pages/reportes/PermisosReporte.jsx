import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Grid, TextField, MenuItem, Button,
  Alert, CircularProgress, Chip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

export default function PermisosReporte() {
  const token = localStorage.getItem("access");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [estado, setEstado] = useState("TODOS");

  const cargarReporte = async () => {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/api/permisos/";
      const params = new URLSearchParams();
      if (estado !== "TODOS") params.append("estado", estado);
      if (fechaInicio) params.append("fecha_requerida__gte", dayjs(fechaInicio).format("YYYY-MM-DD"));
      if (fechaFin) params.append("fecha_requerida__lte", dayjs(fechaFin).format("YYYY-MM-DD"));
      const query = params.toString();
      if (query) url += `?${query}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  const aplicarFiltros = () => cargarReporte();

  const limpiarFiltros = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setEstado("TODOS");
    setTimeout(() => cargarReporte(), 0);
  };

  const exportarExcel = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    const datosExportar = data.map(item => ({
      ID: item.id_permiso,
      Empleado: `${item.empleado_nombre || ''} ${item.empleado_apellido || ''}`.trim(),
      Motivo: item.motivo,
      "Fecha solicitud": item.fecha_solicitud,
      "Fecha requerida": item.fecha_requerida,
      Días: item.dias_solicitados,
      Estado: item.estado
    }));
    const hoja = XLSX.utils.json_to_sheet(datosExportar);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Permisos");
    XLSX.writeFile(libro, `reporte_permisos_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  const columns = [
  { field: "id_permiso", headerName: "ID", width: 80 },
  { field: "empleado_nombre_completo", headerName: "Empleado", width: 250 },
  { field: "motivo", headerName: "Motivo", width: 300 },
  { field: "fecha_solicitud", headerName: "Fecha solicitud", width: 130 },
  { field: "fecha_requerida", headerName: "Fecha requerida", width: 130 },
  { field: "dias_solicitados", headerName: "Días", width: 80, type: "number" },
  {
    field: "estado",
    headerName: "Estado",
    width: 120,
    renderCell: (params) => {
      if (!params || !params.value) return null;
      let color = "default";
      if (params.value === "APROBADO") color = "success";
      else if (params.value === "RECHAZADO") color = "error";
      else if (params.value === "PENDIENTE") color = "warning";
      return <Chip label={params.value} color={color} size="small" />;
    }
  }
];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Reporte de Solicitudes de Permiso</Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Fecha requerida desde"
                value={fechaInicio}
                onChange={setFechaInicio}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Fecha requerida hasta"
                value={fechaFin}
                onChange={setFechaFin}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                select
                label="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="TODOS">Todos</MenuItem>
                <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                <MenuItem value="APROBADO">Aprobado</MenuItem>
                <MenuItem value="RECHAZADO">Rechazado</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" onClick={aplicarFiltros} fullWidth>
                Buscar
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={limpiarFiltros}>Limpiar filtros</Button>
              <Button variant="outlined" onClick={exportarExcel} sx={{ ml: 2 }} disabled={data.length === 0}>Exportar a Excel</Button>
            </Grid>
          </Grid>
        </Paper>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "auto" }} />
        ) : (
          <Paper sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={data}
              columns={columns}
              getRowId={(row) => row.id_permiso}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
            />
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
}