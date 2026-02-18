import { Link, useLocation } from 'react-router-dom';
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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Articles', path: '/all-posts' },
  ];

  return (
    <header className="fixed top-6 inset-x-0 z-50 px-4 pointer-events-none">
      <div className="container max-w-5xl mx-auto pointer-events-auto">
        <div className="glass rounded-full pl-6 pr-2 py-2 flex items-center justify-between shadow-2xl transition-all duration-300 border border-white/10 bg-black/40 backdrop-blur-xl">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group mr-8">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
               <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Blogify
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-1.5 py-1 border border-white/5 mx-auto">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path 
                    ? 'text-white bg-white/10 shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center gap-2 ml-4">
            {authStatus ? (
              <>
                <Link to="/add-post" className="hidden sm:block">
                   <Button size="sm" className="h-10 rounded-full px-5 bg-gradient-to-r from-primary/80 to-purple-600/80 hover:from-primary hover:to-purple-600 text-white border border-white/10 shadow-lg shadow-purple-900/20 transition-all hover:scale-105">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                      Write
                   </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div role="button" tabIndex={0} className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all hover:scale-105 shadow-inner bg-white/5 cursor-pointer flex items-center justify-center shrink-0 group">
                      <Avatar className="h-full w-full flex items-center justify-center bg-zinc-900">
                        <AvatarImage src={userData?.profilePicture} alt={userData?.name} className="object-cover w-full h-full" />
                        <AvatarFallback className="bg-primary text-white font-bold flex items-center justify-center w-full h-full text-sm absolute inset-0">
                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-card p-2 mr-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-0 mb-2">
                        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                            <div className="relative h-9 w-9 rounded-full overflow-hidden border border-white/10 shrink-0 flex items-center justify-center bg-zinc-900">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={userData?.profilePicture} alt={userData?.name} className="object-cover w-full h-full" />
                                    <AvatarFallback className="bg-primary text-white text-xs font-bold flex items-center justify-center w-full h-full absolute inset-0">
                                        {userData?.name?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <p className="text-sm font-medium leading-none text-white truncate">{userData?.name}</p>
                                <p className="text-xs leading-none text-slate-400 mt-1 truncate">{userData?.email}</p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white rounded-md cursor-pointer">
                      <Link to="/profile" className="flex items-center w-full">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                          <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="p-0 focus:bg-transparent">
                      <div className="w-full">
                         <LogoutBtn />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5 rounded-full px-4 h-9">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="h-9 bg-primary hover:bg-primary/90 text-white rounded-full px-5 font-semibold transition-all shadow-lg shadow-primary/20">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-slate-300 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 ml-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                ) : (
                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/></svg>
                )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-4 right-4 pointer-events-auto md:hidden">
          <div className="glass rounded-3xl p-5 animate-scale-in border border-white/10 shadow-2xl bg-black/60 backdrop-blur-2xl">
             <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={`px-5 py-3.5 text-base font-medium rounded-2xl transition-all ${
                       location.pathname === link.path 
                       ? 'bg-primary/20 text-white border border-primary/20' 
                       : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
             </nav>
            
            {authStatus ? (
               <div className="border-t border-white/10 mt-5 pt-5">
                    <div className="flex items-center gap-3 mb-5 px-2">
                        <Avatar className="h-10 w-10 border border-white/20">
                            <AvatarImage src={userData?.profilePicture} alt={userData?.name} />
                            <AvatarFallback className="bg-primary text-white font-bold">{userData?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-white font-medium">{userData?.name}</p>
                            <p className="text-xs text-slate-400">{userData?.email}</p>
                        </div>
                    </div>
                    
                    <Link to="/add-post" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-primary to-purple-600 text-white justify-center mb-3 rounded-xl h-11 border border-white/10">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                            Write Article
                        </Button>
                    </Link>
                    <div className="grid gap-3">
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-center text-white border-white/10 hover:bg-white/5 rounded-xl h-11">Profile</Button>
                        </Link>
                         <LogoutBtn className="w-full justify-center h-11" />
                    </div>
               </div>
            ) : (
                <div className="border-t border-white/10 mt-5 pt-5 grid gap-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-center text-white border-white/10 hover:bg-white/5 rounded-xl h-11">Log in</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 transition-all">
                            Sign up
                        </Button>
                    </Link>
                </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


