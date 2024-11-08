import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import link from "../assets/link.json";
import axios from 'axios';
import debounce from 'lodash.debounce';
import Editor from '@monaco-editor/react';

const socket = io(link.url);

function Project() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("cpp");
  const [testcase, setTestcase] = useState("0");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVidOff, setIsVidOff] = useState(false);
  const [usersJoined, setUsersJoined] = useState([]);

  const params = new URLSearchParams(window.location.search);
  const projId = params.get("id");
  const email = localStorage.getItem("email");

  const userVid = useRef();
  const peerConnections = useRef({});
  const videoRefs = useRef({}); // Store each user's video ref dynamically

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${link.url}/get-project-details?projId=${projId}`);
        setText(data.user_input);
      } catch (err) {
        setError("Error fetching project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projId]);

  useEffect(() => {
    socket.emit("joinProject", { projId, email });
    console.log(`User ${email} joined project ${projId}`);

    return () => {
      socket.disconnect();
    };
  }, [projId, email]);


    const setupPeerConnection = (socketId) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("signal", { signal: event.candidate, socketId });
        }
      };

      pc.ontrack = (event) => {
        if (videoRefs.current[socketId]) {
          videoRefs.current[socketId].srcObject = event.streams[0];
        }
      };

      navigator.mediaDevices.getUserMedia({ video: !isVidOff, audio: !isMuted })
        .then((stream) => {
          if (userVid.current) {
            userVid.current.srcObject = stream;
          }
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        })
        .catch((err) => console.error("Error accessing media devices:", err));

      peerConnections.current[socketId] = pc;
    };


  useEffect(() => {
    socket.on("updatedText", (updatedText) => {
      console.log("Updated text received from server:", updatedText);
      setText(updatedText);
    });
    return () => {
      socket.off("updatedText");
    };
  }, []);

useEffect(() => {
    // Listen for user joining
  socket.on("userJoinedVideo", ({ email, socketId }) => {
    setUsersJoined((prev) => [...prev, { email, socketId }]);
    setupPeerConnection(socketId); // Set up peer connection for new user
  });

  // Listen for signal messages (offer, answer, ice candidate)
  socket.on("signal", async ({ signal, sender }) => {
    const pc = peerConnections.current[sender] || setupPeerConnection(sender);

    if (signal.type === "offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("signal", { signal: answer, socketId: sender });
    } else if (signal.type === "answer") {
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
    } else {
      pc.addIceCandidate(new RTCIceCandidate(signal));
    }
  });

  // Listen for user disconnection
  socket.on("disconnect", () => {
    console.log(`User with socket id: ${socket.id} disconnected`);
    socket.broadcast.emit("userDisconnected", { socketId: socket.id });
    
    // Clean up the peer connection for the disconnected user
    if (peerConnections.current[socket.id]) {
      peerConnections.current[socket.id].close();
      delete peerConnections.current[socket.id];
    }
  });

  // Cleanup socket connection on unmount
  return () => {
    socket.disconnect();
  };
}, []);

  const emitWriting = debounce((newText) => {
    socket.emit("writing", { projId, text: newText });
  }, 300);

  const handleEditorChange = (value) => {
    setText(value);
    emitWriting(value || "");
  };

  const saveCode = debounce(async () => {
    try {
      await axios.post(`${link.url}/save-code`, { code: text, projId });
    } catch (err) {
      console.error("Error saving code:", err);
    }
  }, 2000);

  useEffect(() => {
    saveCode();
  }, [text, projId]);

  useEffect(() => {
    socket.emit("langChange", { projId, newLang: lang });
    socket.on("newLang", (newLang) => {
      setLang(newLang);
    });

    return () => {
      socket.off("newLang");
    };
  }, [lang]);

  const handleCompile = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${link.url}/compile`, {
        code: text,
        language: lang,
        testCases: testcase,
      });
      setOutput(data.output || "No output available");
    } catch (err) {
      setError(err.response?.data?.error || "Compilation error: Please check your code for syntax issues.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Project ID: {projId}</h1>

      <div className="flex gap-4 mb-4">
        <select
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="python">PYTHON</option>
        </select>

        <button
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
          onClick={handleCompile}
          disabled={loading}
        >
          {loading ? "Compiling..." : "Compile"}
        </button>
      </div>

      <div className="w-full h-[60vh] mb-4 border border-gray-700 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          theme="vs-dark"
          language={lang}
          value={text}
          onChange={handleEditorChange}
        />
      </div>

      <textarea
        className="w-full p-4 h-32 bg-gray-800 rounded-lg border border-gray-700 mb-4 text-white"
        rows={10}
        placeholder="Enter Custom Testcase"
        value={testcase}
        onChange={(e) => setTestcase(e.target.value)}
      />

      {loading && (
        <div className="flex justify-center items-center text-green-500 font-semibold mt-4">
          <svg
            className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"
            viewBox="0 0 24 24"
          ></svg>
          Loading...
        </div>
      )}

      {error && (
        <div className="text-red-500 bg-red-800 rounded-lg p-4 mb-4 w-full text-center whitespace-pre-wrap">
          <h3 className="font-semibold">Compilation Error:</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 mt-4">
        <h2 className="text-lg font-semibold mb-2">Output:</h2>
        <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {usersJoined.map(({ email, socketId }) => (
          <div key={socketId} className="flex flex-col items-center">
            <video
              ref={(el) => (videoRefs.current[socketId] = el)}
              autoPlay
              className="border border-gray-600 w-48 h-36"
            />
            <span className="text-sm mt-2">{email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Project;
