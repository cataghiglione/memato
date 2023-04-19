import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAuthProvider } from '../auth/auth'
import { useMySystem } from '../service/mySystem'
import MenuSidebarWrapper from './MenuDropdown'
import '../css/Home.css'
import { useNavigate } from 'react-router-dom'

export const HomePage = () => {
    const mySystem = useMySystem()
    const auth = useAuthProvider()
    const token = auth.getToken()
    const navigate = useNavigate()

    const [user, setUser] = useState('')

    useEffect(() => {
        mySystem.getUser(token, (user) => {
            setUser(user)
            if (!user) {
                navigate('/login')
            }
        })
    }, [token, navigate])

    return (
        <div>
            {user && (
                <div>
                    <MenuSidebarWrapper />
                    <div className="containerPrincipal">
                        <div>
                            <h1>Hi {user.firstName}</h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
