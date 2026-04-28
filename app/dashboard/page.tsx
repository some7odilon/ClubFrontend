"use client"

import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ProtectedRoute } from '../components/ProtectedRoute'
import ClubManagement from '../components/ClubManagement'
import UserStats from '../components/UserStats'
import UserProfile from '../components/UserProfile'
import UserInfoBar from '../components/UserInfoBar'

const page = () => {

  const { user, isLoading } = useAuth()

   if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

  return (
    <ProtectedRoute allowedRoles={['membre', 'tresorier', 'president']}>
      <div className="min-h-screen bg-base-200">
                
                <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-10">
                    <div className="flex-1">
                        <a className="btn btn-ghost text-xl" href="/dashboard">
                        Club Management
                        </a>
                    </div>
                    <div className="flex-none">
                        <UserInfoBar />
                    </div>
                </div>

                <div className="container mx-auto ">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                        <div className="lg:col-span-1">
                            <UserProfile />
                        </div>
                        
                        
                        <div className="lg:col-span-2 space-y-6">
                            
                            <UserStats />
                            
                            <ClubManagement />
                        </div>
                    </div>
                </div>
            </div>
    
    </ProtectedRoute>
  )
}

export default page
