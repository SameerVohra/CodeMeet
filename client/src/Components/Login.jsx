import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Button, Box, Grid, Typography, Alert, Link } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import link from '../assets/link.json';
import { useNavigate } from 'react-router';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${link.url}/login`, { email, password });
      setErr('');
      if (response.status === 201) {
        localStorage.setItem("email", response.data.email);
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPass((prev) => !prev);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #1A2980, #26D0CE)',
        color: 'white',
      }}
    >
      <Grid item xs={11} sm={8} md={4}>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            p: 5,
            borderRadius: 4,
            boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Welcome Back!
          </Typography>

          {err && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
              {err}
            </Alert>
          )}

          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&:hover fieldset': { borderColor: '#ffffff' },
                '&.Mui-focused fieldset': { borderColor: '#26D0CE' },
                '& input': { color: 'white' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ color: 'white' }}>
                    {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&:hover fieldset': { borderColor: '#ffffff' },
                '&.Mui-focused fieldset': { borderColor: '#26D0CE' },
                '& input': { color: 'white' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#1A2980',
              backgroundColor: '#ffffff',
              borderRadius: 3,
              transition: '0.3s',
              '&:hover': {
                backgroundColor: '#26D0CE',
                color: '#ffffff',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Typography variant="body2" sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.8)' }}>
            Don't have an account?{' '}
            <Link href="/register" sx={{ color: '#26D0CE', textDecoration: 'underline' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
