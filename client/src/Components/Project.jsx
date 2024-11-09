import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import link from "../assets/link.json";
import axios from 'axios';
import debounce from 'lodash.debounce';
import Editor from '@monaco-editor/react';

const socket = io(link.url);

function Project() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("cpp");
  const [testcase, setTestcase] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  const params = new URLSearchParams(window.location.search);
  const projId = params.get("id");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${link.url}/get-project-details?projId=${projId}`);
        setText(lang === 'cpp' ? data.user_code[0].input : data.user_code[1].input);
      } catch (err) {
        setError("Error fetching project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projId, lang]);

  useEffect(() => {
    socket.emit("joinProject", { projId, email });
    const welcomeSocket = (msg) => setUsers((prev) => [...prev, msg]);
    const removeSocket = (msg) => setUsers((prev) => prev.filter((email) => email !== msg));

    socket.on("greet", welcomeSocket);
    socket.on("remove", removeSocket);
    return () => {
      socket.off("greet", welcomeSocket);
      socket.off("remove", removeSocket);
      socket.disconnect();
    };
  }, [projId, email]);

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
      const data = await axios.post(`${link.url}/save-code`, { code: text, projId, lang });
      console.log(data);
    } catch (err) {
      console.error("Error saving code:", err);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSaveCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between bg-gray-900 text-white min-h-screen p-6 w-full">
      {/* Header */}
      <header className="w-full max-w-4xl bg-indigo-800 rounded-md shadow-lg p-4 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CODE MEET</h1>
        <p className="text-sm text-gray-300">Project ID: {projId}</p>
      </header>

      {/* Active Users Panel */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-md p-4 mb-4">
        <h2 className="font-semibold text-lg">Active Users</h2>
        <div className="flex gap-2 flex-wrap">
          {users.map((user, index) => (
            <p key={index} className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">{user}</p>
          ))}
        </div>
      </div>

      {/* Controls and Language Selection */}
      <div className="flex gap-4 mb-6 w-full max-w-4xl justify-between">
        <select
          className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
        </select>

        <button
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition-colors"
          onClick={handleCompile}
          disabled={loading}
        >
          {loading ? "Compiling..." : "Compile"}
        </button>

        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
          onClick={handleSaveCode}
        >
          Save Code
        </button>
        <p className="text-sm text-gray-400">or press Ctrl+S to save</p>
      </div>

      {/* Code Editor */}
      <div className="w-full max-w-4xl h-[60vh] mb-4 border border-gray-700 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          theme="vs-dark"
          language={lang}
          value={text}
          onChange={handleEditorChange}
        />
      </div>

      {/* Test Case Input */}
      <textarea
        className="w-full max-w-4xl p-4 h-32 bg-gray-800 rounded-lg border border-gray-700 mb-4 text-white"
        rows={4}
        placeholder="Enter custom test cases"
        value={testcase}
        onChange={(e) => setTestcase(e.target.value)}
      />

      {/* Loading and Error Messages */}
      {loading && (
        <div className="flex justify-center items-center text-green-500 font-semibold mt-4">
          <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
          Loading...
        </div>
      )}

      {error && (
        <div className="text-red-500 bg-red-800 rounded-lg p-4 mb-4 w-full max-w-4xl text-center">
          <h3 className="font-semibold">Compilation Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Output Display */}
      <div className="w-full max-w-4xl p-4 bg-gray-800 rounded-lg border border-gray-700 mt-4">
        <h2 className="text-lg font-semibold mb-2">Output:</h2>
        <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
      </div>
    </div>
  );
}

export default Project;
