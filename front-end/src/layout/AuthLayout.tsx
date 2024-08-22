import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

const AuthLayout = (props: Props) => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
    <div className="hidden md:flex flex-1 items-center justify-center bg-gray-200">
      <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg" alt="Auth Image" className="w-full h-full object-contain" />
    </div>
  </div>
  )
}

export default AuthLayout