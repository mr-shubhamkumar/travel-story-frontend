import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from '../../utils/helper'
function ProfileInfo({userInfo,onLogout }) {
  const isToken = localStorage.getItem("token")
  
  
     
  return (
    <div>  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{getInitials(userInfo ? userInfo.fullname : "")}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
      
        <span className="text-sm font-medium">{ userInfo ? userInfo.fullname : ""}</span>
    
        {
          isToken &&  <Button onClick={onLogout}  variant="link" className="h-auto p-0 text-xs text-gray-500 hover:text-gray-700">
          Logout
        </Button>
        }
        
      </div>
    </div>
  </div></div>
  )
}

export default ProfileInfo