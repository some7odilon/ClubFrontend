import React from 'react'
import { ProtectedRoute } from '../components/ProtectedRoute'
import GestionUser from '../components/Admin'

const page = () => {

  return (
    <ProtectedRoute allowedRoles={ ["president"] } >
        <GestionUser />
      
    </ProtectedRoute>
  )
}

export default page
