import axios from 'axios';
import React, { useState } from 'react';
import link from '../assets/link.json';
import { TextField, Button, CircularProgress, Alert, Typography, Card, CardContent } from '@mui/material';

function MakeProject() {
  const [projName, setProjName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleMake = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (projName.trim() === '') {
      setError('Project name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${link.url}/make-project`, {
        email: localStorage.getItem('email'),
        projName,
      });
      console.log(data);
      setSuccess(true);
      setProjName('');
      if(data.status===201){
        window.location.reload();
      }
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardContent>
          <Typography variant="h5" className="mb-4 text-center">
            Make a New Project
          </Typography>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">Project created successfully!</Alert>}

          <form onSubmit={handleMake} className="flex flex-col space-y-4">
            <TextField
              variant="outlined"
              label="Project Name"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Make Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default MakeProject;
