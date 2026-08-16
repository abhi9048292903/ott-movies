import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#e50914" },
    background: { default: "#0b0b0f", paper: "#16161d" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
});
