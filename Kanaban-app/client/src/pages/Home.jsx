import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <div>
      <div>

        <button onClick={()=>{navigate("/login")}}>Go To Login Page, Click Here</button>

      </div>
    </div>
   
  )
}

export default Home