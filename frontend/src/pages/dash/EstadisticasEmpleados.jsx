import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Grid, TextField, MenuItem, Button,
  Alert, CircularProgress, Card, CardContent
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

export default function EstadisticasEmpleados() {
  const token = localStorage.getItem("access");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ counts: null, employees: [] });

  // Filtros
  const [genero, setGenero] = useState("");
  const [renglon, setRenglon] = useState("");
  const [servicio, setServicio] = useState("");
  const [colegiado, setColegiado] = useState("");

  // Opciones para combos
  const [renglones, setRenglones] = useState([]);
  const [servicios, setServicios] = useState([]);

  // Cargar opciones iniciales
  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const [resRenglones, resServicios] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/renglones/", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://127.0.0.1:8000/api/servicios/", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setRenglones(resRenglones.data);
        setServicios(resServicios.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar opciones");
      }
    };
    fetchOpciones();
  }, [token]);

  // Función para obtener datos con filtros
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (genero) params.append("genero", genero);
      if (renglon) params.append("renglon", renglon);
      if (servicio) params.append("servicio", servicio);
      if (colegiado) params.append("colegiado", colegiado);
      const url = `http://127.0.0.1:8000/api/estadisticas/empleados/?${params.toString()}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  // Efecto inicial: cargar sin filtros
  useEffect(() => {
    cargarDatos();
  }, []);

  // Exportar a Excel
  const exportarExcel = () => {
    if (data.employees.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    const datosExportar = data.employees.map(emp => ({
      "Número": emp.numero_empleado,
      "Nombre": emp.nombre_completo,
      "Renglón": emp.renglon_codigo,
      "Servicio": emp.servicio_nombre,
      "Ubicación": emp.ubicacion_fisica,
      "Colegiado": emp.colegiado_activo,
      "Género": emp.genero,
      "Puesto": emp.puesto_oficial,
      "Departamento": emp.departamento,
      "Municipio": emp.municipio,
      "Fecha contratación": emp.fecha_contratacion,
      "Salario": emp.salario
    }));
    const hoja = XLSX.utils.json_to_sheet(datosExportar);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Empleados");
    XLSX.writeFile(libro, `estadisticas_empleados_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  // Columnas del DataGrid
  const columns = [
    { field: "numero_empleado", headerName: "Número", width: 130 },
    { field: "nombre_completo", headerName: "Nombre completo", width: 250 },
    { field: "renglon_codigo", headerName: "Renglón", width: 100 },
    { field: "servicio_nombre", headerName: "Servicio", width: 150 },
    { field: "ubicacion_fisica", headerName: "Ubicación", width: 150 },
    { field: "colegiado_activo", headerName: "Colegiado", width: 100 },
    { field: "genero", headerName: "Género", width: 100 },
    { field: "puesto_oficial", headerName: "Puesto", width: 150 },
    { field: "departamento", headerName: "Departamento", width: 130 },
    { field: "municipio", headerName: "Municipio", width: 130 },
    { field: "fecha_contratacion", headerName: "F. contratación", width: 130 },
    { field: "salario", headerName: "Salario (Q)", width: 120 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Estadísticas de Empleados</Typography>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Género"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Renglón"
              value={renglon}
              onChange={(e) => setRenglon(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              {renglones.map(r => (
                <MenuItem key={r.id_renglon} value={r.id_renglon}>
                  {r.codigo} - {r.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Servicio"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              {servicios.map(s => (
                <MenuItem key={s.id_servicio} value={s.id_servicio}>
                  {s.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              select
              label="Colegiado activo"
              value={colegiado}
              onChange={(e) => setColegiado(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button variant="contained" onClick={cargarDatos} fullWidth>
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : (
        <>
          {/* Tarjetas de conteos */}
          {data.counts && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Por género */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Género</Typography>
                    {data.counts.genero.map(g => (
                      <Typography key={g.id_persona__genero}>
                        {g.id_persona__genero === 'M' ? 'Masculino' : g.id_persona__genero === 'F' ? 'Femenino' : 'No especificado'}: {g.total}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              {/* Colegiado */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Colegiado activo</Typography>
                    <Typography>Sí: {data.counts.colegiado.colegiado_activo}</Typography>
                    <Typography>No: {data.counts.colegiado.no_colegiado}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Renglones más relevantes (top 5) */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Por renglón (top)</Typography>
                    {data.counts.renglon.slice(0, 5).map(r => (
                      <Typography key={r.id_renglon}>
                        {r.codigo} - {r.descripcion}: {r.total}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              {/* Servicios más relevantes (top 5) */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Por servicio (top)</Typography>
                    {data.counts.servicio.slice(0, 5).map(s => (
                      <Typography key={s.id_servicio}>
                        {s.nombre}: {s.total}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Tabla de empleados */}
          <Paper sx={{ height: 500, width: "100%" }}>
            <Box sx={{ p: 1, textAlign: "right" }}>
              <Button variant="outlined" onClick={exportarExcel} disabled={data.employees.length === 0}>
                Exportar a Excel
              </Button>
            </Box>
            <DataGrid
              rows={data.employees}
              columns={columns}
              getRowId={(row) => row.id_empleado}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
            />
          </Paper>
        </>
      )}
    </Box>
  );
}