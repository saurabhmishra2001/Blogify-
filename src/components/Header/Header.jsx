import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogoutBtn } from '../index';
import { useState } from 'react';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
          </svg>
          <span className="font-bold text-xl gradient-text">Blogify</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/explore" className="text-sm font-medium hover:text-primary transition-colors">
            Explore
          </Link>
          <Link to="/all-posts" className="text-sm font-medium hover:text-primary transition-colors">
            All Posts
          </Link>
          
          {authStatus ? (
            <>
              <Link to="/add-post" className="text-sm font-medium hover:text-primary transition-colors">
                Add Post
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center space-x-2 h-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {userData?.profilePicture ? (
                        <AvatarImage src={userData.profilePicture} alt={userData.name} />
                      ) : (
                        <AvatarFallback>{userData?.name?.charAt(0) || 'U'}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm font-medium">{userData?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogoutBtn className="w-full text-left text-red-600 hover:text-red-700" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button 
                  variant="ghost"
                  className="font-medium px-6 py-2 hover:bg-primary/10 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  className="font-medium px-6 py-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          {authStatus && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {userData?.profileImage ? (
                  <AvatarImage src={userData.profileImage} alt={userData.name} />
                ) : (
                  <AvatarFallback>{userData?.name?.charAt(0) || 'U'}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium">{userData?.name}</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-16 6h16"/>
            </svg>
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            {authStatus && (
              <div className="pb-4 mb-4 border-b border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-10 w-10">
                    {userData?.profileImage ? (
                      <AvatarImage src={userData.profileImage} alt={userData.name} />
                    ) : (
                      <AvatarFallback>{userData?.name?.charAt(0) || 'U'}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{userData?.name}</p>
                    <p className="text-sm text-muted-foreground">{userData?.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Links */}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
