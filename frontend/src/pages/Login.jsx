// import { useState } from "react";
// import { TextField, Button, Container, Box, Typography } from "@mui/material";
// import { login } from "../services/authService";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const data = await login(username, password);

//       localStorage.setItem("access", data.access);
//       localStorage.setItem("refresh", data.refresh);
//       const res = await fetch("http://127.0.0.1:8000/api/me/", {
//       headers: {
//         Authorization: `Bearer ${data.access}`,
//       },
//     });

//     const userData = await res.json();

//     localStorage.setItem("user", JSON.stringify(userData));

//       navigate("/dashboard");
//     } catch (error) {
//       alert("Credenciales incorrectas");
//     }
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box mt={10}>
//         <Typography variant="h5">Iniciar Sesión</Typography>

//         <TextField
//           fullWidth
//           margin="normal"
//           label="Usuario"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <TextField
//           fullWidth
//           margin="normal"
//           type="password"
//           label="Contraseña"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ mt: 2 }}
//           onClick={handleLogin}
//         >
//           Ingresar
//         </Button>
//       </Box>
//     </Container>
//   );
// }
// src/pages/Login.jsx
// src/pages/Login.jsx
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

       const res = await fetch("http://127.0.0.1:8000/api/me/", {
      //const res = await fetch("http://192.168.86.163:8000/api/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      const userData = await res.json();
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 10% 20%, #1a4d80, #337ab7)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo degradado
            backdropFilter: "blur(12px)",         // Efecto vidrio
            borderRadius: "2rem",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          
          <Box
            component="img"
            src="/src/assets/logo-hospital.png" 
            alt="Logo Hospital"
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              borderRadius: "50%",
              objectFit: "cover",
              backgroundColor: "white",
              p: 0.5,
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "white", textTransform: "uppercase", mb: 1 }}
          >
            LOGIN
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 3 }}>
            Please enter your login and password!
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{
              style: { color: "white" },
              sx: {
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              },
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{
              style: { color: "white" },
              sx: {
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              },
            }}
          />
          
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "white",
              color: "#0f2027",
              fontWeight: "bold",
              borderRadius: "2rem",
              py: 1,
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
            onClick={handleLogin}
          >
            LOGIN
          </Button>

        </Paper>
      </Container>
    </Box>
  );
}