import React from 'react'
import {Routes,Route} from "react-router-dom"
import Login from '../pages/login'
import Home from '../pages/Home'
import Register from '../pages/register'
import KanbanBoard from './KanbanBoard'


function AllRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element= { <Login/> } />
            <Route path='/register' element={<Register />}/>
            <Route path="/kanban" element={<KanbanBoard/>}/>
        </Routes>
    </div>
  )
}

export default AllRoutes