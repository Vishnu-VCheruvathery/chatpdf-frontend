// import React, { useState } from 'react'
import { useEffect, useRef, useState } from 'react';
import StreamedMarkdown from './Markdown';
import { socket } from '../socket';
import DropFileInput from './DropFileInput';
import { useParams } from 'react-router-dom';
import {ClipLoader} from 'react-spinners'
import api from '../../api/instance';

type Message = {
  role: 'user' | 'ai';
  content: string;
  mode: string
}


const Conversation = () => {
  const {id} = useParams();
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('docs_only')
   const messagesEndRef = useRef<HTMLDivElement | null>(null);
      const dialogRef = useRef<HTMLDialogElement>(null);
        const [input, setInput] = useState("");
       const onFileChange = (files: File[]) => {
     console.log(files);
   };

    async function getMessages() {
      try {
        const response = await api.post(`/users/messages?id=${id}`)
        console.log(response.data)
        setMessages(response.data)
      } catch (error) {
        console.log(error);
      }
    }

     useEffect(() => {
      messagesEndRef.current?.scrollIntoView({behavior: "smooth" });
    }, [messages])

      const handleSend = () => {
  if (!input.trim()) return;

  socket.emit("msg", {input, convId: id, mode});

  setMessages((prev) => [
    ...prev,
    { role: "user", content: input , mode},
    { role: "ai", content: "" , mode}
  ]);

  setInput("");
  setLoading(true)
};

 useEffect(() => {
  if (!id) return;

  socket.emit("joinConversation", { convId: id });

  const handler = (text: string) => {
    setLoading(false);

    setMessages((prev) => [
      ...prev,
      { role: "ai", content: text, mode },
    ]);
  };

  socket.on("response", handler);

  socket.on("connect", () => {
    socket.emit("joinConversation", { convId: id });
  });

  return () => {
    socket.off("response", handler);
  };
}, [id, mode]);

     useEffect(() => {
      getMessages()
     }, [id])

  function modeSwitch(mode: string) {
  switch (mode) {
    case "docs_only":
      return "/pdf.png";

    case "web_only":
      return "/search.png";

    default:
      return "/pdf.png";
  }
}

  return (
    <>
     <div className="w-full mb-40 flex flex-col items-center">
{messages.map((message, index) => {
  if (message.content.trim().length === 0) return null;

  return (
    <div key={index} className="w-1/2 flex flex-col pt-10 gap-4">
      <h3 className="text-white font-bold">{message.role}:</h3>
      <StreamedMarkdown text={message.content} />
    </div>
  );
})}

  {/* ✅ Spinner shown while loading */}
  {loading && (
    <div className="mt-6">
      <ClipLoader size={40} color="white" />
    </div>
  )}

  <div ref={messagesEndRef} />
</div>
       <div className="w-full h-24 fixed bottom-5 flex items-center justify-center gap-2 p-4">
      <div className="w-1/2 h-full flex items-center bg-white rounded-md gap-4 px-4">
        <div className="dropdown dropdown-top dropdown-center">
  <div tabIndex={0} role="button" className="btn m-1">
    <img src={modeSwitch(mode)} className="w-6 h-6"/>
  </div>
  <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    <li onClick={() => setMode('docs_only')}><a>Search Doc</a></li>
    <li onClick={() => setMode('web_only')}><a>Google Search</a></li>
  </ul>
</div>
        <button
          className="btn btn-square"
          onClick={() => dialogRef.current?.showModal()}
        >
          <img src="/clip.png" className="w-8 h-8" />
        </button>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box box-border overflow-y-auto max-h-[80vh]">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <DropFileInput onFileChange={onFileChange} convId={id}/>
          </div>
        </dialog>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white w-5/6 h-3/4 text-black p-2 rounded-md resize-none outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Your prompt..."
        />

        <button onClick={handleSend}>
          <img src="/send.png" className="w-8 h-8" />
        </button>
      </div>
    </div>
    </>
   
  )
}

export default Conversation