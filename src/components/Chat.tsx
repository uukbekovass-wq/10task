import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';

interface ChatMessage {
    sender: string;
    text: string;
    timestamp: number;
}

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const navigate = useNavigate();
    const chatBoxRef = useRef<HTMLDivElement>(null);
    
    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        const ws = new WebSocket('wss://inai-col3.fishrungames.com/chat/');
        wsRef.current = ws;

        ws.onopen = () => {
            // Отправляем токен для авторизации сокета
            ws.send(JSON.stringify({
                type: "AUTH",
                payload: { token: token }
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'AUTH_SUCCESS') {
                setIsConnected(true);
            } 
            else if (data.type === 'NEW_MESSAGE') {
                setMessages((prev) => [...prev, data.payload]);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        return () => {
            ws.close();
        };
    }, [navigate]);

    // Прокрутка вниз при новом сообщении
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !isConnected || !wsRef.current) return;

        wsRef.current.send(JSON.stringify({
            type: "CHAT_MESSAGE",
            payload: { text: newMessage }
        }));
        
        setNewMessage('');
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h3>Групповой Чат</h3>
                <div className="header-right">
                    <span className={`status ${isConnected ? 'online' : 'offline'}`}>
                        {isConnected ? 'В сети' : 'Подключение...'}
                    </span>
                    <button onClick={handleLogout} className="logout-btn">Выйти</button>
                </div>
            </header>

            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((msg, index) => {
                    const isMe = msg.sender === currentUser;
                    return (
                        <div key={index} className={`message-wrapper ${isMe ? 'me' : 'other'}`}>
                            {!isMe && <span className="sender-name">{msg.sender}</span>}
                            <div className="message-bubble">
                                <p>{msg.text}</p>
                                <span className="time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={sendMessage} className="chat-input-form">
                <input 
                    type="text" 
                    placeholder="Введите сообщение..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={!isConnected}
                />
                <button type="submit" disabled={!isConnected || !newMessage.trim()}>
                    Отправить
                </button>
            </form>
        </div>
    );
}