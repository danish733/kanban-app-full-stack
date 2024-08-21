import React, { useState } from 'react'
import './Register.css';
import axios from "axios"
import { useNavigate } from 'react-router-dom';


function Register() {
    const navigate = useNavigate()
    const [registerData,setRegisterData] = useState({
        name:"",
        email:"",
        password:"",
        role:"user"
    })
    const handleChange=(e) =>{
        setRegisterData({
            ...registerData,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit =async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.post("https://kanban-app-full-stack.onrender.com/user/register", registerData)
            alert(response.data.message)
            console.log(response.data.message)
            navigate("/login")
        } catch (error) {
            alert(error.response.data.message)
            console.log(error)
        }
    }
  return (
    <div className="container">
        <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="">Name</label>
                    <input type="text" name='name' value={registerData.name} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="">Email</label>
                    <input type="email" name='email' value={registerData.email} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="">Password</label>
                    <input type="text" name='password' value={registerData.password} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="">Role</label>
                    <select name='role' value={registerData.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <button type='submit'>Register Now</button>
                </div>
        </form>
    </div>
  )
}

export default Register