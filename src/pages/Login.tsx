import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../api";
import { useAuth } from "../auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@ott.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const data = await loginRequest(email, password);
      login(data.access_token, data.role);
      navigate("/admin/movies");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Admin login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" fullWidth>
        Sign in
      </Button>
    </Box>
  );
}
