import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginUser(username, password);
            navigate('/chat');
        } catch (err) {
            setError('Ошибка входа. Проверьте логин и пароль.');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Вход в Чат</h2>
                {error && <div className="error-message">{error}</div>}
                <input 
                    type="text" 
                    placeholder="Логин" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Пароль" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Войти</button>
                <p>Нет аккаунта? <Link to="/register">Регистрация</Link></p>
            </form>
        </div>
    );
}