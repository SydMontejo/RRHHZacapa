import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ListarContratos() {

  const [data, setData] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/contratos/", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data));
  }, []);

  const columns = [
    //{ field: "id_contrato", headerName: "ID", width: 80 },
    { field: "empleado_nombre_completo", headerName: "Empleado", width: 400 },
    { field: "tipo_contrato", headerName: "Tipo", width: 100 },
    { field: "fecha_inicio", headerName: "Inicio", width: 120 },
    { field: "fecha_fin", headerName: "Fin", width: 120 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Contratos</Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          component={Link}
          to="/dashboard/contratos/crear"
        >
          Crear Contrato
        </Button>
      </Box>

      <div style={{ height: 500 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id_contrato}
        />
      </div>
    </Box>
  );
}