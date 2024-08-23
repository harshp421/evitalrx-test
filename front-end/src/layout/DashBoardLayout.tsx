import Navbar from '@/components/shared/Navbar'
import { Outlet } from 'react-router-dom'

const DashBoardLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default DashBoardLayout