import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import link from "../assets/link.json";
import axios from 'axios';
import debounce from 'lodash.debounce';
import Editor from '@monaco-editor/react';

const socket = io(link.url, {withCredentials:true});

function Project() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("cpp");
  const [testcase, setTestcase] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [isError, setIsError] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const projId = params.get("id");
  const email = localStorage.getItem("email");

  useEffect(() => {
    socket.on("connection", (socket)=>console.log("Socket joined", socket))
    socket.emit("joinProject", { projId, email });
    socket.on("user:joined", ({ usersJoined }) => {
      setUsers(usersJoined);
    });
    return () => {
      if (socket.connected) {
        socket.emit("leave:project", { email, projId });
        socket.disconnect();
      }
      socket.off("user:joined");
      socket.off("user:disconnected");
    };
  }, [projId, email]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${link.url}/get-project-details?projId=${projId}`);
        setText(lang === 'cpp' ? data.user_code[0].input : lang==='python'? data.user_code[1].input : data.user_code[2].input); 
      } catch (err) {
        setError("Error fetching project details. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projId, lang]);


  useEffect(() => {
    socket.on("user:disconnected", ({ usersJoined }) => {
      setUsers(usersJoined)
    });
  }, []);

  useEffect(() => {
    socket.on("updatedText", (updatedText) => setText(updatedText));
    return () => socket.off("updatedText");
  }, []);

  const emitWriting = debounce((newText) => {
    socket.emit("writing", { projId, text: newText });
  }, 300);

  const handleEditorChange = (value) => {
    setText(value);
    emitWriting(value || "");
  };

  const handleSaveCode = async () => {
    try {
      setIsSaving(true);
      if (text.trim() !== "") {
        const response = await axios.post(`${link.url}/save-code`, { code: text, projId, lang });
        if (response.status === 201) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 5000);
        }
      }
    } catch (err) {
      setError("Error saving code. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    socket.emit("langChange", { projId, newLang: lang });
    socket.on("newLang", (newLang) => setLang(newLang));
    return () => socket.off("newLang");
  }, [lang]);

  const handleCompile = async () => {
    setLoading(true);
    setError("");
    setIsError(false);
    try {
      const { data } = await axios.post(`${link.url}/compile`, {
        code: text,
        language: lang,
        testCases: testcase,
      });
      setOutput(data.output || "No output available");
    } catch (err) {
      console.log(err)
      setIsError(true);
      setOutput(err.response.data.error);
      setError("Compilation error: Please check your code for syntax issues.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-8 w-full">
      <header className="w-full max-w-4xl bg-indigo-700 shadow-lg rounded-lg p-6 flex justify-between items-center mb-8 text-white">
        <h1 className="text-3xl font-bold">CODE MEET</h1>
        <p className="text-xs">Project ID: {projId}</p>
      </header>

      {error && (
        <div className="fixed top-10 right-10 bg-red-700 text-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="fixed top-10 right-10 bg-green-600 text-white p-4 rounded-lg shadow-lg">
          <p>Code saved successfully!</p>
        </div>
      )}

      <div className="flex gap-4 mb-8 w-full max-w-4xl justify-between">
        <select
          className="px-4 py-2 bg-gray-800 text-white rounded-md"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="c">C</option>
        </select>

        <button
          className="px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold shadow-md transition"
          onClick={handleCompile}
          disabled={loading}
        >
          {loading ? "Compiling..." : "Compile"}
        </button>

        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition"
          onClick={handleSaveCode}
        >
          {isSaving ? "Saving..." : "Save Code"}
        </button>
      </div>

      <div className="w-full max-w-4xl mb-8">
        <Editor
          height="60vh"
          theme="vs-dark"
          language={lang}
          value={text}
          onChange={handleEditorChange}
          className="shadow-lg rounded-lg border border-gray-700"
        />
      </div>

      <textarea
        className="w-full max-w-4xl p-4 h-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 mb-8"
        rows={4}
        placeholder="Enter custom test cases"
        value={testcase}
        onChange={(e) => setTestcase(e.target.value)}
      />

      <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 mt-4">
        <h2 className="text-lg font-semibold mb-2">Output:</h2>
        <pre className={`whitespace-pre-wrap ${isError ? 'text-red-500' : 'text-green-400'}`}> {output} </pre>
      </div>


      <h1 className="mt-6 font-bold text-lg text-gray-300">Joined Users</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full max-w-4xl">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-4 space-x-4 shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
              {user.charAt(0).toUpperCase()}
            </div>
            <p className="text-gray-300 font-medium">
              {user === email ? `${user} (YOU)` : user}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Project;
