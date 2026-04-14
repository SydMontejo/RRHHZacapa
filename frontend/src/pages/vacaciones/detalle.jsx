import { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody, Chip, Alert, Typography, Paper, CircularProgress
} from "@mui/material";
import axios from "axios";

export default function VacacionesRevisadas() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    cargarRevisadas();
  }, []);

  const cargarRevisadas = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/vacaciones/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const revisadas = response.data.filter(v => v.estado !== "PENDIENTE");
      setSolicitudes(revisadas);
      setError(null);
    } catch (err) {
      setError("Error al cargar solicitudes revisadas");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoDisplay = (vacacion) => {
    if (vacacion.estado === "APROBADO") {
      const hoy = new Date().toISOString().slice(0, 10);
      if (vacacion.fecha_inicio <= hoy && vacacion.fecha_fin >= hoy) {
        return "EN EJECUCIÓN";
      }
    }
    return vacacion.estado;
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "APROBADO": return "success";
      case "RECHAZADO": return "error";
      case "EN EJECUCIÓN": return "info";
      default: return "default";
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Vacaciones Revisadas (Aprobadas / Rechazadas)
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Empleado</TableCell>
            <TableCell>Fechas</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Documento</TableCell>
            <TableCell>Observaciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {solicitudes.map((v) => (
            <TableRow key={v.id_vacacion}>
              <TableCell>{v.empleado_nombre} {v.empleado_apellido}</TableCell>
              <TableCell>{v.fecha_inicio} a {v.fecha_fin}</TableCell>
              <TableCell>
                <Chip
                  label={getEstadoDisplay(v)}
                  color={getEstadoColor(getEstadoDisplay(v))}
                />
              </TableCell>
              <TableCell>
                {v.documento_url ? (
                  <a href={v.documento_url} target="_blank" rel="noreferrer">Ver PDF</a>
                ) : "N/A"}
              </TableCell>
              <TableCell>{v.observaciones || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}