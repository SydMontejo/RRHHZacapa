import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Paper, Button, CircularProgress, Chip } from "@mui/material";

export default function DetallePermiso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [permiso, setPermiso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/permisos/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setPermiso(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, token]);

  if (loading) return <CircularProgress />;
  if (!permiso) return <Typography>No se encontró el permiso</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Detalle del Permiso #{permiso.id_permiso}</Typography>
        <Typography><strong>Empleado:</strong> {permiso.empleado_nombre_completo}</Typography>
        <Typography><strong>Motivo:</strong> {permiso.motivo}</Typography>
        <Typography><strong>Fecha solicitud:</strong> {permiso.fecha_solicitud}</Typography>
        <Typography><strong>Fecha requerida:</strong> {permiso.fecha_requerida}</Typography>
        <Typography><strong>Días solicitados:</strong> {permiso.dias_solicitados}</Typography>
        <Typography component="div"><strong>Estado:</strong> <Chip label={permiso.estado} color={permiso.estado === "APROBADO" ? "success" : permiso.estado === "RECHAZADO" ? "error" : "warning"} /></Typography>
        {permiso.fecha_aprobacion && <Typography><strong>Fecha aprobación:</strong> {permiso.fecha_aprobacion}</Typography>}
        {permiso.observaciones && <Typography><strong>Observaciones:</strong> {permiso.observaciones}</Typography>}
        {permiso.documento_url && (
          <Typography>
            <strong>Documento:</strong> <a href={permiso.documento_url} target="_blank" rel="noopener noreferrer">Ver PDF</a>
          </Typography>
        )}
        {permiso.autorizado_por && (
          <Typography><strong>Autorizado por:</strong> {permiso.autorizado_por}</Typography>
        )}
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/dashboard/permisos")}>Volver</Button>
      </Paper>
    </Box>
  );
}