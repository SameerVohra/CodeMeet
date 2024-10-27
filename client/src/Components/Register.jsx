import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography, Alert, Link } from '@mui/material';
import axios from 'axios';
import link from '../assets/link.json';
import { useNavigate } from 'react-router';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${link.url}/register`, { email, password });
      console.log(response);
      setErr('');
      if(response.status === 201){
        navigate('/')
      }
      // Redirect to login or home page after successful registration
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundColor: '#ffccbc', // Soft peach background
        color: '#3e2723', // Dark brown text color
      }}
    >
      <Grid item xs={11} sm={8} md={5}>
        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{
            p: 5,
            borderRadius: 3,
            boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.5)',
            backgroundColor: 'white', // White background for the form
          }}
        >
          <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
            Sign Up
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
                  borderColor: '#d7ccc8',
                },
                '&:hover fieldset': {
                  borderColor: '#bcaaa4',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#795548',
                },
                '& input': { // Set input text color
                  color: '#3e2723',
                },
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d7ccc8',
                },
                '&:hover fieldset': {
                  borderColor: '#bcaaa4',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#795548',
                },
                '& input': { // Set input text color
                  color: '#3e2723',
                },
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d7ccc8',
                },
                '&:hover fieldset': {
                  borderColor: '#bcaaa4',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#795548',
                },
                '& input': { // Set input text color
                  color: '#3e2723',
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
              backgroundColor: '#8d6e63',
              '&:hover': {
                backgroundColor: '#6f4c41',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 2, color: '#3e2723' }}>
            Already have an account?{' '}
            <Link href="/" variant="body2" sx={{ color: '#8d6e63', textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Register;
