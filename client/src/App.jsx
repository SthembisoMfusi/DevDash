import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function checkUserStatus() {
            try {
                const response = await fetch('http://localhost:3000/auth/status', {
                    credentials: 'include',
                })

                if (response.ok) {
                    const userData = await response.json()
                    setUser(userData)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Error fetching user status:', error)
                setError('Failed to check authentication status')
                setUser(null)
            }

            setLoading(false)
        }

        checkUserStatus()
    }, [])

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })

            if (response.ok) {
                setUser(null)
                setError(null)
            } else {
                setError('Logout failed')
            }
        } catch (error) {
            console.error('Logout error:', error)
            setError('Logout failed')
        }
    }

    if (loading) {
        return (
            <div className="loading">
                <h1>Loading...</h1>
            </div>
        )
    }

    const LoginButton = () => (
        <div className="login-section">
            <a href="http://localhost:3000/auth/github" className="login-button">
                Login with GitHub
            </a>
        </div>
    )

    const UserInfo = () => (
        <div className="user-section">
            <h2>Welcome, {user.username}!</h2>
            {user.name && <p>Name: {user.name}</p>}
            {user.email && <p>Email: {user.email}</p>}
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    )

    return (
        <>
            <div className="logo-section">
                <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>DevDash</h1>

            {error && (
                <div className="error-message">
                    <p>Error: {error}</p>
                </div>
            )}

            <div className="card">
                {user ? <UserInfo /> : <LoginButton />}
            </div>
        </>
    )
}

export default App