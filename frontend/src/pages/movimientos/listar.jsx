import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Box, Typography, IconButton, TextField, Button, Paper,
  Alert, CircularProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ListarMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/api/movimientos-personal/";
      if (search.trim() !== "") {
        url += `?search=${encodeURIComponent(search)}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovimientos(response.data);
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este movimiento?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/movimientos-personal/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData(inputValue);
      } catch (err) {
        setError("Error al eliminar");
      }
    }
  };

  const columns = [
    { field: "id_movimiento", headerName: "ID", width: 80 },
    { field: "empleado_nombre_completo", headerName: "Empleado", width: 300 },
    { field: "empleado_numero", headerName: "No. Empleado", width: 130 },
    { field: "tipo", headerName: "Tipo", width: 180 },
    { field: "fecha_efectiva", headerName: "Fecha efectiva", width: 130 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`/dashboard/movimientos/${params.row.id_movimiento}`)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/dashboard/movimientos/editar/${params.row.id_movimiento}`)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleEliminar(params.row.id_movimiento)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Movimientos de Personal</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Buscar por empleado (nombre, número o tipo)"
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          component={Link}
          to="/dashboard/movimientos/crear"
        >
          Nuevo Movimiento
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={movimientos}
          columns={columns}
          getRowId={(row) => row.id_movimiento}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Paper>
    </Box>
  );
}