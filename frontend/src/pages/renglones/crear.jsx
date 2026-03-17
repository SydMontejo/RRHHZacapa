// import { useState } from "react";
// import { Box, TextField, Button, Typography } from "@mui/material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function CrearRenglon() {

//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     codigo: "",
//     descripcion: "",
//     tipo_presupuestario: "",
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post("http://127.0.0.1:8000/api/renglones/", form, 
//         {
//         headers: { Authorization: `Bearer ${token}`},}
//       );

//       alert("Renglón creado correctamente");

//       navigate("/dashboard/renglones");

//     } catch (error) {
//       console.error(error);
//       alert("Error al crear el renglón");
//     }
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: 500 }}>
//       <Typography variant="h5" mb={2}>
//         Crear Renglón
//       </Typography>

//       <form onSubmit={handleSubmit}>

//         <TextField
//           label="Código"
//           name="codigo"
//           fullWidth
//           margin="normal"
//           onChange={handleChange}
//           required
//         />

//         <TextField
//           label="Descripción"
//           name="descripcion"
//           fullWidth
//           margin="normal"
//           onChange={handleChange}
//           required
//         />

//         <TextField
//           label="Tipo Presupuestario"
//           name="tipo_presupuestario"
//           fullWidth
//           margin="normal"
//           onChange={handleChange}
//           required
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Guardar
//         </Button>

//       </form>
//     </Box>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

export default function CrearRenglon() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access"); // Obtener token

  const [form, setForm] = useState({
    codigo: "",
    descripcion: "",
    tipo_presupuestario: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post("http://127.0.0.1:8000/api/renglones/", form, {
        headers: { Authorization: `Bearer ${token}` }, // Token en headers
      });

      setSuccess("Renglón creado correctamente");
      setTimeout(() => navigate("/dashboard/renglones"), 1500); // Redirigir después de mostrar éxito
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setError("No autorizado. Verifica tu sesión.");
      } else {
        setError("Error al crear el renglón");
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Crear Renglón
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        label="Código"
        name="codigo"
        value={form.codigo}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Descripción"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Tipo Presupuestario"
        name="tipo_presupuestario"
        value={form.tipo_presupuestario}
        onChange={handleChange}
        margin="normal"
        required
      />

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Guardar
      </Button>
    </Box>
  );
}