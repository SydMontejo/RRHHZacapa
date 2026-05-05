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

export default function VacacionesReporte() {
  const token = localStorage.getItem("access");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  // Estados para filtros
  const [fechaInicioAfter, setFechaInicioAfter] = useState(null);   // fecha_inicio_after
  const [fechaInicioBefore, setFechaInicioBefore] = useState(null); // fecha_inicio_before
  const [estado, setEstado] = useState("TODOS");

  const cargarReporte = async () => {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/api/vacaciones/";
      const params = new URLSearchParams();

      if (estado !== "TODOS") params.append("estado", estado);
      if (fechaInicioAfter) params.append("fecha_inicio_after", dayjs(fechaInicioAfter).format("YYYY-MM-DD"));
      if (fechaInicioBefore) params.append("fecha_inicio_before", dayjs(fechaInicioBefore).format("YYYY-MM-DD"));

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
    setFechaInicioAfter(null);
    setFechaInicioBefore(null);
    setEstado("TODOS");
    setTimeout(() => cargarReporte(), 0);
  };

  const exportarExcel = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    const datosExportar = data.map(item => ({
      "Número de Empleado": item.empleado_numero || '',
      "Empleado": item.empleado_nombre_completo || '',
      "Ubicación Física": item.empleado_ubicacion || '',
      "Fecha Solicitud": item.fecha_solicitud,
      "Fecha Inicio": item.fecha_inicio,
      "Fecha Fin": item.fecha_fin,
      "Días Solicitados": item.dias_solicitados,
      "Estado": item.estado,
      "Observaciones": item.observaciones || '',
      "Fecha Aprobación": item.fecha_aprobacion || ''
    }));
    const hoja = XLSX.utils.json_to_sheet(datosExportar);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Vacaciones");
    XLSX.writeFile(libro, `reporte_vacaciones_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  const columns = [
    { field: "id_vacacion", headerName: "ID", width: 80 },
    { field: "empleado_nombre_completo", headerName: "Empleado", width: 250 },
    { field: "fecha_solicitud", headerName: "Fecha solicitud", width: 130 },
    { field: "fecha_inicio", headerName: "Fecha inicio", width: 120 },
    { field: "fecha_fin", headerName: "Fecha fin", width: 120 },
    { field: "dias_solicitados", headerName: "Días", width: 80, type: "number" },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => {
        if (!params || !params.value) return null;
        let color = "default";
        if (params.value === "APROBADO") color = "success";
        else if (params.value === "RECHAZADO") color = "error";
        else if (params.value === "PENDIENTE") color = "warning";
        else if (params.value === "EN_EJECUCION") color = "info";
        return <Chip label={params.value} color={color} size="small" />;
      }
    },
    { field: "observaciones", headerName: "Observaciones", width: 200 },
    { field: "fecha_aprobacion", headerName: "Fecha aprobación", width: 130 }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Reporte de Solicitudes de Vacaciones</Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <DatePicker
                label="Fecha inicio - desde"
                value={fechaInicioAfter}
                onChange={setFechaInicioAfter}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <DatePicker
                label="Fecha inicio - hasta"
                value={fechaInicioBefore}
                onChange={setFechaInicioBefore}
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
            <Grid item xs={12} sm={4}>
              <Button variant="contained" onClick={aplicarFiltros} sx={{ mr: 1 }}>
                Buscar
              </Button>
              <Button variant="outlined" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={exportarExcel} disabled={data.length === 0}>
                Exportar a Excel
              </Button>
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
              getRowId={(row) => row.id_vacacion}
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