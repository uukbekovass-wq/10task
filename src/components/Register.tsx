import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(username, password);
            navigate('/login');
        } catch (err) {
            setError('Ошибка регистрации. Возможно, пользователь уже есть.');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Регистрация</h2>
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
                <button type="submit">Создать аккаунт</button>
                <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
            </form>
        </div>
    );
}