import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <div>
        <nav>navbar</nav>
        <Outlet/>
    </div>
  )
}

export default AdminLayout