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

  const params = new URLSearchParams(window.location.search);
  const projId = params.get("id");
  const email = localStorage.getItem("email");

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
    return () => {
      socket.disconnect();
    };
  }, [projId, email]);

  const emitWriting = debounce((newText) => {
    socket.emit("writing", { projId, text: newText });
    socket.on('updatedText', (updatedText) => {
      setText(updatedText);
    });
  }, 300);

  const handleEditorChange = (value) => {
    setText(value);
    emitWriting(value);
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
          <option value="java">JAVA</option>
          <option value="python">PYTHON</option>
          <option value="javascript">JAVASCRIPT</option>
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
          defaultValue={`#include<iostream>\nusing namespace std;\n\nint main(){\n\t\n\treturn 0;\n}`}
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
    </div>
  );
}

export default Project;