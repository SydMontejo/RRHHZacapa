import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#2e7d32",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial",
  },
});

export default theme;