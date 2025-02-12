import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios, { AxiosResponse } from 'axios';

type ServerResponse = string[];

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const send = () => {
    axios
      .post<ServerResponse, AxiosResponse<ServerResponse>>(
        'http://localhost:3000/messages',
        { message })
      .then(() => setMessage(''))
      .catch(err => console.log(err));
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      send();
    }
  }

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", () => {
      socket.send("Hello Server!");
      console.log('Connection open');
    });

    socket.addEventListener("message", (event) => {
      setMessages(messages => [event.data, ...messages]);
    });

    return () => {
      socket.close();
    }

  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Short Polling</h1>
      <div className="card">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleKeyPress}
        />
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
