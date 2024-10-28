import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Button, Box, Grid, Typography, Alert, Link } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import link from '../assets/link.json';
import { useNavigate } from 'react-router';

function Login() {
  const navigate = useNavigate()
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
      console.log(response);
      setErr('');
      if(response.status===201){
        localStorage.setItem("email", response.data.email)
        navigate("/home");
      }
    } catch (error) {
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
        background: 'linear-gradient(135deg, #4A90E2, #005C99)',
        color: 'white',
      }}
    >
      <Grid item xs={11} sm={8} md={4}>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 4)',
            backgroundColor: 'rgba(180, 180, 180)',
          }}
        >
          <Typography variant="h4" gutterBottom textAlign="center" sx={{ color: 'white' }}>
            Welcome Back!
          </Typography>

          {err && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4A90E2',
                },
                '& input': { // Set input text color
                  color: 'white',
                },
              },
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
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4A90E2',
                },
                '& input': { // Set input text color
                  color: 'white',
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#4A90E2',
              '&:hover': {
                backgroundColor: '#005C99',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 2, color: 'white' }}>
            Don't have an account?{' '}
            <Link href="/register" variant="body2" sx={{ color: 'white', textDecoration: 'none' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
