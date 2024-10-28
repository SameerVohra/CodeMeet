import React, { useEffect, useState } from 'react';
import MakeProject from './MakeProject';
import JoinProject from './JoinProject';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Collapse, 
  Tooltip 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import link from "../assets/link.json";
import axios from 'axios';

function Home() {
  const [make, setMake] = useState(false);
  const [join, setJoin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    const getProj = async () => {
      try {
        const { data } = await axios.get(
          `${link.url}/get-projects?email=${localStorage.getItem("email")}`
        );
        console.log(data);
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    getProj();
  }, []);

  const togglePasswordVisibility = (index) => {
    setShowPassword((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="flex space-x-4 mb-6">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setMake(!make);
            setJoin(false);
          }}
          className={`transition-transform duration-200 ${make ? 'scale-105' : ''}`}
        >
          Make A New Project
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setJoin(!join);
            setMake(false);
          }}
          className={`transition-transform duration-200 ${join ? 'scale-105' : ''}`}
        >
          Join A Project
        </Button>
      </div>

      <div className="w-full max-w-lg">
        {make && (
          <Card className="bg-white shadow-md mb-6">
            <CardContent>
              <MakeProject />
            </CardContent>
          </Card>
        )}

        {join && (
          <Card className="bg-white shadow-md">
            <CardContent>
              <JoinProject />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="w-full max-w-lg mt-8">
        {projects.length > 0 ? (
          projects.map((proj, index) => (
            <Card key={index} className="bg-white shadow-md mb-4">
              <CardContent>
                <Typography variant="h6" className="mb-2 font-medium">
                  Project Name: {proj.projName}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  Project ID: {proj.code}
                </Typography>

                <div className="flex items-center">
                  <Tooltip title="Show/Hide Password">
                    <IconButton
                      onClick={() => togglePasswordVisibility(index)}
                      className="text-gray-700"
                    >
                      {showPassword[index] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>

                  <Collapse in={showPassword[index]}>
                    <Typography 
                      variant="body2" 
                      className="ml-2 font-mono text-gray-700"
                    >
                      {proj.password}
                    </Typography>
                  </Collapse>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" className="text-center text-gray-600">
            No projects found. Start by creating one!
          </Typography>
        )}
      </div>
    </div>
  );
}

export default Home;
