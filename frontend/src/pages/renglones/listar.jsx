// import { useEffect, useState } from "react";
// import { Box, Typography } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";

// export default function ListarRenglones() {

//   const [renglones, setRenglones] = useState([]);

//   const obtenerRenglones = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/renglones/");
//       setRenglones(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     obtenerRenglones();
//   }, []);

//   const columnas = [
//     { field: "id_renglon", headerName: "ID", width: 90 },
//     { field: "codigo", headerName: "Código", width: 120 },
//     { field: "descripcion", headerName: "Descripción", width: 250 },
//     { field: "tipo_presupuestario", headerName: "Tipo", width: 200 },
//     {
//       field: "activo",
//       headerName: "Activo",
//       width: 120,
//       renderCell: (params) => (params.value ? "Sí" : "No"),
//     },
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" mb={2}>
//         Renglones
//       </Typography>

//       <div style={{ height: 500, width: "100%" }}>
//         <DataGrid
//           rows={renglones}
//           columns={columnas}
//           getRowId={(row) => row.id_renglon}
//         />
//       </div>
//     </Box>
//   );
// }

import { useEffect, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function ListarRenglones() {
  const [renglones, setRenglones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  const obtenerRenglones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/renglones/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRenglones(res.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setError("No autorizado. Verifica tu sesión.");
      } else {
        setError("Error al cargar los renglones.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerRenglones();
  }, []);

  const columnas = [
    { field: "id_renglon", headerName: "ID", width: 90 },
    { field: "codigo", headerName: "Código", width: 120 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    { field: "tipo_presupuestario", headerName: "Tipo", width: 200 },
    {
      field: "activo",
      headerName: "Activo",
      width: 120,
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Renglones
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={renglones}
          columns={columnas}
          getRowId={(row) => row.id_renglon}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
        />
      </div>
    </Box>
  );
}