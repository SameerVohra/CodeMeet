import axios from 'axios';
import React, { useState } from 'react';
import link from "../assets/link.json";
import { TextField, Button, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router';

function JoinProject() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const handleJoin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!code || !password) {
      setError("Please enter both project code and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await axios.post(`${link.url}/join-project`, {
        code,
        password,
        email: localStorage.getItem("email"),
      });
      console.log(data);
      
      if(data.status===201){
        setSuccess(true);
        setCode("");
        setPassword("");
        navigate(`/project?id=${code}`)
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Failed to join the project.");
      } else {
        setError("Network error. Please try again.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardContent>
          <Typography variant="h5" className="mb-4 text-center">
            Join a Project
          </Typography>

          {/* Display success or error messages */}
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">Successfully joined the project!</Alert>}

          <form onSubmit={handleJoin} className="flex flex-col space-y-4">
            <TextField
              label="Project Code"
              variant="outlined"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
              required
              InputProps={{ className: "text-white" }}
              InputLabelProps={{ className: "text-gray-400" }}
            />
            <TextField
              label="Project Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              InputProps={{ className: "text-white" }}
              InputLabelProps={{ className: "text-gray-400" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Join Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default JoinProject;
