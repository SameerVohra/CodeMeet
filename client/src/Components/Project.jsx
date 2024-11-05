import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import link from "../assets/link.json";
import axios from 'axios';
import debounce from 'lodash.debounce';
import Editor from '@monaco-editor/react';

const socket = io(link.url);

function Project() {
  const [text, setText] = useState("");
  const params = new URLSearchParams(window.location.search);
  const projId = params.get("id");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data } = await axios.get(`${link.url}/get-project-details?projId=${projId}`);
        setText(data.user_input);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    fetchProjectDetails();
  }, [projId]);

  useEffect(() => {
    socket.emit("joinProject", { projId, email });

    socket.on("updatedText", (newText) => {
      setText(newText);
    });

    return () => {
      socket.off("updatedText");
      socket.disconnect();
    };
  }, [projId, email]);

  const emitWriting = debounce((newText) => {
    socket.emit("writing", { projId, text: newText });
  }, 300);

  const handleEditorChange = (value) => {
    setText(value || "");
    emitWriting(value || "");
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        await axios.post(`${link.url}/save-code`, {
          code: text,
          projId
        });
      } catch (error) {
        console.error("Error saving code:", error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [text, projId]);

  return (
    <>    
      <h1>Project ID: {projId}</h1>
      <div className='w-full h-[80vh]'>
        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          language="cpp"
          onChange={handleEditorChange}
          value={text}
          defaultValue={`#include<iostream>\nusing namespace std;\n\nint main(){\n\t\n\treturn 0;\n}`}
        />
      </div>
    </>
  );
}

export default Project;
