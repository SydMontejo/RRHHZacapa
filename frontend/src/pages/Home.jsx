import { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { People, BeachAccess, PendingActions, RequestPage } from "@mui/icons-material";
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    empleadosVacaciones: 0,
    permisosPendientes: 0,
    vacacionesPendientes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");

  // Función para obtener y actualizar los datos
  const fetchData = async () => {
    try {
      
      const empleadosRes = await axios.get("http://127.0.0.1:8000/api/empleados/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const empleados = empleadosRes.data;
      
      const totalEmpleados = empleados.filter(emp => emp.activo === true && emp.deleted_at === null).length;

      // Obtener permisos
      const permisosRes = await axios.get("http://127.0.0.1:8000/api/permisos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const permisos = permisosRes.data;
      const permisosPendientes = permisos.filter(p => p.estado === "PENDIENTE").length;

      // Obtener vacaciones
      const vacacionesRes = await axios.get("http://127.0.0.1:8000/api/vacaciones/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vacaciones = vacacionesRes.data;
      const vacacionesPendientes = vacaciones.filter(v => v.estado === "PENDIENTE").length;

      // Empleados actualmente de vacaciones (APROBADO y hoy dentro del rango)
      const hoy = new Date().toISOString().slice(0, 10);
      const empleadosEnVacaciones = vacaciones.filter(v => 
        v.estado === "APROBADO" && v.fecha_inicio <= hoy && v.fecha_fin >= hoy
      ).length;

      setStats({
        totalEmpleados,
        empleadosVacaciones: empleadosEnVacaciones,
        permisosPendientes,
        vacacionesPendientes,
      });
      setError(null);
    } catch (err) {
      console.error("Error cargando datos del Home:", err);
      setError("No se pudieron cargar algunos datos. Mostrando valores por defecto.");
      // En caso de error, los valores a 0
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
    // Actualiza cada 30 segundos 
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval); 
  }, [token]);

  const statCards = [
    { title: "COLABORADORES ACTIVOS", value: stats.totalEmpleados, icon: <People sx={{ fontSize: 40 }} />, color: "#1976d2" },
    { title: "EMPLEADOS EN VACACIONES", value: stats.empleadosVacaciones, icon: <BeachAccess sx={{ fontSize: 40 }} />, color: "#2e7d32" },
    { title: "SOLICITUDES PERMISO PENDIENTES", value: stats.permisosPendientes, icon: <PendingActions sx={{ fontSize: 40 }} />, color: "#ed6c02" },
    { title: "SOLICITUDES VACACIONES PENDIENTES", value: stats.vacacionesPendientes, icon: <RequestPage sx={{ fontSize: 40 }} />, color: "#9c27b0" },
  ];

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Banner */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          backgroundColor: "#337ab7",
          color: "white",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "200px",
        }}
      >
        {/* Texto centrado */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            HOSPITAL REGIONAL DE ZACAPA
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            "Juntos Construyendo un Servicio con Calidad Humana"
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
            BIENVENIDO AL PORTAL DE RECURSOS HUMANOS
          </Typography>
        </Box>
        {/* Logo a la derecha*/}
        <Box
          component="img"
          src="/src/assets/logo-hospital.png"  
          alt="Logo del hospital"
        //   sx={{ height: 225, position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)" }}
        sx={{
              width: 225,
              height: 225,
              mb: 2,
              borderRadius: "50%",
              objectFit: "cover",
              backgroundColor: "white",
              p: 0.5,
            }}
        />
      </Paper>

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Tarjetas */}
      <Grid container spacing={3}>
        {statCards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ textAlign: "center", p: 2, boxShadow: 3, backgroundColor: "#337ab7", color: "white" }}>
                <Box sx={{ color: "black" }}>{card.icon}</Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", my: 1, color: "black" }}>
                    {card.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "black" }}>
                    {card.title}
                </Typography>
                </Card>
            </Grid>
        ))}
      </Grid>
    </Box>
  );
}