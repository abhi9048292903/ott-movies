import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState, type MouseEvent } from "react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function AppLayout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  function openMenu(event: MouseEvent<HTMLElement>) {
    setAnchor(event.currentTarget);
  }

  function closeMenu() {
    setAnchor(null);
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/" sx={{ mr: 2, fontWeight: 600 }}>
            Home
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            OTT Finder
          </Typography>
          <IconButton color="inherit" aria-label="Account" onClick={openMenu}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
            {token ? (
              [
                <MenuItem
                  key="admin"
                  onClick={() => {
                    closeMenu();
                    navigate("/admin/movies");
                  }}
                >
                  Data entry
                </MenuItem>,
                <MenuItem
                  key="logout"
                  onClick={() => {
                    closeMenu();
                    logout();
                    navigate("/");
                  }}
                >
                  Log out
                </MenuItem>,
              ]
            ) : (
              [
                <MenuItem
                  key="login"
                  onClick={() => {
                    closeMenu();
                    navigate("/login");
                  }}
                >
                  Login
                </MenuItem>,
                <MenuItem
                  key="signup"
                  onClick={() => {
                    closeMenu();
                    navigate("/login?tab=signup");
                  }}
                >
                  Sign up
                </MenuItem>,
              ]
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
