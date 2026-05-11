import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const API_BASE = "http://127.0.0.1:8000/api/";
// ----------------------------------------------------------------------
// Configuración de entidades
// ----------------------------------------------------------------------
const ENTITIES = {
  personas: {
    label: "Personas",
    endpoint: `${API_BASE}personas/`,
    getRowId: (row) => row.id_persona,
    columns: [
      { field: "dpi", headerName: "DPI", width: 130 },
      { field: "primer_nombre", headerName: "Primer nombre", width: 130 },
      { field: "segundo_nombre", headerName: "Segundo nombre", width: 130 },
      { field: "primer_apellido", headerName: "Primer apellido", width: 130 },
      { field: "segundo_apellido", headerName: "Segundo apellido", width: 130 },
      { field: "correo", headerName: "Correo", width: 200 },
      { field: "telefono", headerName: "Teléfono", width: 130 },
      { field: "departamento", headerName: "Departamento", width: 130 },
      { field: "municipio", headerName: "Municipio", width: 130 },
      { field: "activo", headerName: "Activo", width: 90, renderCell: (p) => (p.value ? "Sí" : "No") },
    ],
    transformData: (data) => data, // array
  },
  empleados: {
    label: "Empleados",
    endpoint: `${API_BASE}empleados/`,
    getRowId: (row) => row.id_empleado,
    columns: [
      { field: "numero_empleado", headerName: "Número", width: 130 },
      { field: "persona_nombre", headerName: "Nombre", width: 200 },
      { field: "renglon_codigo", headerName: "Renglón", width: 100 },
      { field: "servicio_nombre", headerName: "Servicio", width: 150 },
      { field: "ubicacion_fisica", headerName: "Ubicación", width: 150 },
      { field: "colegiado_activo", headerName: "Colegiado", width: 100 },
      { field: "activo", headerName: "Activo", width: 90, renderCell: (p) => (p.value ? "Sí" : "No") },
    ],
    transformData: (data) => data,
  },
  contratos: {
    label: "Contratos",
    endpoint: `${API_BASE}contratos/`,
    getRowId: (row) => row.id_contrato,
    columns: [
      { field: "id_empleado_numero", headerName: "N° Empleado", width: 130 },
      { field: "empleado_nombre", headerName: "Empleado", width: 200 },
      { field: "tipo_contrato", headerName: "Tipo", width: 100 },
      { field: "renglon_codigo", headerName: "Renglón", width: 100 },
      { field: "servicio_nombre", headerName: "Servicio", width: 150 },
      { field: "fecha_inicio", headerName: "Fecha inicio", width: 120 },
      { field: "fecha_fin", headerName: "Fecha fin", width: 120 },
      { field: "salario", headerName: "Salario (Q)", width: 120 },
      { field: "activo", headerName: "Activo", width: 90, renderCell: (p) => (p.value ? "Sí" : "No") },
    ],
    transformData: (data) =>
      data.map((contrato) => ({
        ...contrato, // mantiene id_contrato
        id_empleado_numero: contrato.id_empleado?.numero_empleado || "",
        empleado_nombre: contrato.id_empleado?.persona_nombre || "",
        renglon_codigo: contrato.id_renglon?.codigo || "",
        servicio_nombre: contrato.id_servicio?.nombre || "",
      })),
  },
  permisos: {
    label: "Permisos",
    endpoint: `${API_BASE}permisos/`,
    getRowId: (row) => row.id_permiso,
    columns: [
      { field: "empleado_numero", headerName: "N° Empleado", width: 130 },
      { field: "empleado_nombre", headerName: "Empleado", width: 200 },
      { field: "motivo", headerName: "Motivo", width: 250 },
      { field: "fecha_solicitud", headerName: "Fecha solicitud", width: 120 },
      { field: "fecha_requerida", headerName: "Fecha requerida", width: 120 },
      { field: "dias_solicitados", headerName: "Días", width: 80 },
      { field: "estado", headerName: "Estado", width: 120 },
      { field: "autorizado_por", headerName: "Autorizado por", width: 150 },
    ],
    transformData: (data) =>
      data.map((perm) => ({
        ...perm,
        empleado_numero: perm.empleado_numero || "",
        empleado_nombre: perm.empleado_nombre_completo || "",
      })),
  },
  vacaciones: {
    label: "Vacaciones",
    endpoint: `${API_BASE}vacaciones/`,
    getRowId: (row) => row.id_vacacion,
    columns: [
      { field: "empleado_numero", headerName: "N° Empleado", width: 130 },
      { field: "empleado_nombre", headerName: "Empleado", width: 200 },
      { field: "fecha_solicitud", headerName: "Fecha solicitud", width: 120 },
      { field: "fecha_inicio", headerName: "Fecha inicio", width: 120 },
      { field: "fecha_fin", headerName: "Fecha fin", width: 120 },
      { field: "dias_solicitados", headerName: "Días", width: 80 },
      { field: "estado", headerName: "Estado", width: 120 },
      { field: "observaciones", headerName: "Observaciones", width: 200 },
    ],
    transformData: (data) =>
      data.map((vac) => ({
        ...vac,
        empleado_numero: vac.empleado_numero || "",
        empleado_nombre: vac.empleado_nombre_completo || "",
      })),
  },
  sanciones: {
    label: "Sanciones",
    endpoint: `${API_BASE}sanciones/`,
    getRowId: (row) => row.id_sancion,
    columns: [
      { field: "empleado_numero", headerName: "N° Empleado", width: 130 },
      { field: "empleado_nombre", headerName: "Empleado", width: 200 },
      { field: "fecha_sancion", headerName: "Fecha sanción", width: 120 },
      { field: "detalle", headerName: "Detalle", width: 300 },
      { field: "activo", headerName: "Activo", width: 90, renderCell: (p) => (p.value ? "Sí" : "No") },
    ],
    transformData: (data) =>
      data.map((san) => ({
        ...san,
        empleado_numero: san.empleado_numero || "",
        empleado_nombre: san.empleado_nombre || "",
      })),
  },
  movimientos: {
    label: "Movimientos",
    endpoint: `${API_BASE}movimientos-personal/`,
    getRowId: (row) => row.id_movimiento,
    columns: [
      { field: "empleado_numero", headerName: "N° Empleado", width: 130 },
      { field: "empleado_nombre", headerName: "Empleado", width: 200 },
      { field: "tipo", headerName: "Tipo", width: 150 },
      { field: "fecha_efectiva", headerName: "Fecha efectiva", width: 120 },
      { field: "descripcion", headerName: "Descripción", width: 300 },
    ],
    transformData: (data) =>
      data.map((mov) => ({
        ...mov,
        empleado_numero: mov.empleado_numero || "",
        empleado_nombre: mov.empleado_nombre_completo || "",
      })),
  },
};

export default function ListadoGeneral() {
  const token = localStorage.getItem("access");
  const [entidad, setEntidad] = useState("personas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const config = ENTITIES[entidad];

  const cargarDatos = async () => {
  setLoading(true);
  setError("");
  try {
    const response = await axios.get(config.endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Si la respuesta es directamente un array
    const rawData = Array.isArray(response.data) ? response.data : [];
    const transformed = config.transformData(rawData);
    setData(transformed);
  } catch (err) {
    console.error(err);
    setError(`Error al cargar ${config.label}: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (entidad) cargarDatos();
  }, [entidad]);

  const exportarExcel = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    // Cabeceras con los headerName de las columnas
    const headers = config.columns.map((col) => col.headerName);
    const rows = data.map((row) =>
      config.columns.map((col) => row[col.field] ?? "")
    );
    const sheetData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, config.label);
    XLSX.writeFile(wb, `${config.label}_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Listado General de Registros
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Seleccionar tabla</InputLabel>
            <Select
              value={entidad}
              onChange={(e) => setEntidad(e.target.value)}
              label="Seleccionar tabla"
            >
              {Object.keys(ENTITIES).map((key) => (
                <MenuItem key={key} value={key}>
                  {ENTITIES[key].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={exportarExcel} disabled={data.length === 0}>
            Exportar a Excel
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : (
        <Paper sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={config.columns}
            getRowId={config.getRowId}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            disableRowSelectionOnClick
          />
        </Paper>
      )}
    </Box>
  );
}