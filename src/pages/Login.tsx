import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login as loginRequest } from "../api";
import { useAuth } from "../auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "signup" ? "signup" : "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signupNote, setSignupNote] = useState<string | null>(null);

  const title = useMemo(() => (tab === "signup" ? "Create an account" : "Login"), [tab]);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const data = await loginRequest(email, password);
      login(data.access_token, data.role);
      navigate(data.role === "admin" ? "/admin/movies" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  function onSignup(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSignupNote("Public sign up is not open yet. If you already have an account, use Login.");
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {title}
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, value: string) => {
          setError(null);
          setSignupNote(null);
          setParams(value === "signup" ? { tab: "signup" } : {});
        }}
        sx={{ mb: 2 }}
      >
        <Tab value="login" label="Login" />
        <Tab value="signup" label="Sign up" />
      </Tabs>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {signupNote && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {signupNote}
        </Alert>
      )}
      {tab === "login" ? (
        <Box component="form" onSubmit={onLogin}>
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
            Login
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={onSignup}>
          <TextField
            label="Name"
            fullWidth
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            sx={{ mb: 2 }}
          />
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
            Sign up
          </Button>
        </Box>
      )}
    </Box>
  );
}
