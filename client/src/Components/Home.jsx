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
  Tooltip, 
  CardActions 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import link from "../assets/link.json";
import axios from 'axios';
import { useNavigate } from 'react-router';

function Home() {
  const navigate = useNavigate();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6 text-gray-900">
      {/* Header Buttons */}
      <div className="flex space-x-6 mb-8">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setMake(!make);
            setJoin(false);
          }}
          className={`transition-transform duration-300 ${
            make ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-md'
          }`}
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
          className={`transition-transform duration-300 ${
            join ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-md'
          }`}
        >
          Join A Project
        </Button>
      </div>

      {/* Make and Join Cards */}
      <div className="w-full max-w-lg space-y-6">
        {make && (
          <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent>
              <MakeProject />
            </CardContent>
          </Card>
        )}

        {join && (
          <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent>
              <JoinProject />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Project List */}
      <div className="w-full max-w-lg mt-12 space-y-6">
        {projects.length > 0 ? (
          projects.map((proj, index) => (
            <Card
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-2">
                  {proj.projName}
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  Project ID: {proj.code}
                </Typography>

                <div className="flex items-center space-x-4">
                  <Tooltip title="Show/Hide Password">
                    <IconButton
                      onClick={() => togglePasswordVisibility(index)}
                      className="text-gray-700"
                    >
                      {showPassword[index] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>

                  <Typography
                    variant="body1"
                    className={`font-mono text-lg ${
                      !showPassword[index] ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {showPassword[index] ? proj.password : '******'}
                  </Typography>
                </div>
              </CardContent>
              <CardActions className="justify-end">
                <Button
                  size="small"
                  color="primary"
                  className="hover:underline"
                  onClick={()=>navigate(`/project?id=${proj.code}`)}
                >
                  Show Project
                </Button>
              </CardActions>
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
