import { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
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
      headers: {
        Authorization: `Bearer ${data.access}`,
      },
    });

    const userData = await res.json();

    localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Typography variant="h5">Iniciar Sesión</Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Ingresar
        </Button>
      </Box>
    </Container>
  );
}