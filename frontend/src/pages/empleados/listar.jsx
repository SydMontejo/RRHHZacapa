import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Box, Typography } from "@mui/material";

export default function ListarEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/empleados/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setEmpleados(res.data));
  }, []);

  const columnas = [
    { field: "id_empleado", headerName: "ID", width: 80 },
    { field: "persona_nombre", headerName: "Persona", width: 250 },
    { field: "numero_empleado", headerName: "No. Empleado", width: 150 },
    { field: "renglon_codigo", headerName: "Renglón", width: 120 },
    { field: "servicio_nombre", headerName: "Servicio", width: 150 },
    {
      field: "activo",
      headerName: "Activo",
      width: 100,
      renderCell: (p) => (p.value ? "Sí" : "No"),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Empleados</Typography>

      <div style={{ height: 500 }}>
        <DataGrid
          rows={empleados}
          columns={columnas}
          getRowId={(row) => row.id_empleado}
        />
      </div>
    </Box>
  );
}