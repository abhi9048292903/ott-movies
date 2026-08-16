import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";

export default function AppLayout() {
  const { token, logout } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none", fontWeight: 700 }}
          >
            OTT Finder
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Catalog
          </Button>
          {token ? (
            <>
              <Button color="inherit" component={RouterLink} to="/admin/movies">
                Data entry
              </Button>
              <Button color="inherit" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Admin
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
