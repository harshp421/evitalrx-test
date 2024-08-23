import { Button } from '@/components/ui/button'
import { userService } from '@/services/api/user';
import React from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {}

const Dashboard = (props: Props) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
        await userService.logOut();
        // Perform any additional cleanup, like removing tokens from localStorage
        navigate('/login');
    } catch (err) {
        console.error("Logout failed:", err);
    }
  }
  return (
    <div>Dashboard
      <Button onClick={handleLogout}>log out</Button>
    </div>
  )
}

export default Dashboard