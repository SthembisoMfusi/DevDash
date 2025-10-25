import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [message, setMessage] = useState('Loading...')


    useEffect(() => {

        async function fetchData() {
            try {

                const response = await fetch('http://localhost:3000')
                const data = await response.text()


                setMessage(data)
            } catch (error) {
                console.error('Error fetching data:', error)
                setMessage('Error loading data from server')
            }
        }

        fetchData()
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
            <h1>Vite + React</h1>

            {/* 5. Display the message from our server! */}
            <h2>Message from server: "{message}"</h2>

            <div className="card">
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App