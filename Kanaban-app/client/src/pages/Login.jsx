import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "./login.css"

function Login() {
    const navigate = useNavigate()
    const [login,setLogin] = useState({
        email:"",
        password:""
    })

    const handleChange=(e)=>{
        setLogin({
            ...login, 
            [e.target.name]: e.target.value
        })
    }
    const handleSubit=async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.post("https://kanban-app-full-stack.onrender.com/user/login", login)
            const token = response.data.token
            localStorage.setItem("token", token)
            alert(response.data.message)
            console.log(response)
            navigate("/kanban")
        } catch (error) {
            alert(error.response.data.message)
            console.log(error)
        }
    }
  return (
    <div>
        <form onSubmit={handleSubit}>
            <div>
                <label htmlFor="">Email</label>
                <input type="text" name='email' value={login.email} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="">Password</label>
                <input type="text" name="password" value={login.password} onChange={handleChange}/>
            </div>
            <div>
                <button type='submit'>Login Now</button>
            </div>
            <div>
                <button onClick={()=>{navigate("/register")}}>Register</button>
            </div>
        </form>
    </div>
  )
}

export default Login