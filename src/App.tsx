import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import { isAuthenticated } from './api/auth';
import './App.css';

// Исправлено: заменили JSX.Element на any, чтобы TypeScript не ругался
const PrivateRoute = ({ children }: { children: any }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to={isAuthenticated() ? "/chat" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;