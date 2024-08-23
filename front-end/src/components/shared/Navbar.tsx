import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '@/services/api/user'
import { useUser } from '@/context/userContext'
import { getInitials } from '@/lib/utils'


const Navbar = () => {
    const navigate = useNavigate();
    const {user}=useUser();
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
        <nav className="flex justify-between items-center p-4 shadow-md sticky top-0 bg-white ">
            <div className="navbar-log flex items-center justify-center gap-x-3">
                <Link to="/dashboard">
                <img src="https://www.evitalrx.in/webroot/images/evital-images/logo.png" alt="Logo" className="h-10" />
                </Link>
              
            </div>
            <div className="navbar-profile">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>{user?.username ?getInitials(user.username):"CN"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem >
                           <Link to="/profile" className='flex'>
                           <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                           </Link>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem> */}
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                            {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export default Navbar