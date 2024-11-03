import { Container, Logo, LogoutBtn} from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'

function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && 
                !dropdownRef.current.contains(event.target) && 
                !buttonRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false)
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    const navItems = [
        {
            name: 'Home',
            slug: '/',
            active: true
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus
        },
        {
            name: "Add Post",
            slug: '/add-post',
            active: authStatus
        }
    ]

    return (
        
            <Container className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Left side */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
                            <Logo className="w-12 h-12" />
                            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                Blogify
                            </span>
                        </Link>
                    </div>

                    {/* Right Side Navigation and Auth */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Navigation Items */}
                        <ul className="flex items-center space-x-6">
                            {navItems.map((item) => 
                                item.active ? (
                                    <li key={item.name}>
                                        <button 
                                            onClick={() => navigate(item.slug)}
                                            className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                ) : null
                            )}
                        </ul>

                        {/* Auth Buttons */}
                        {!authStatus ? (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <button 
                                    ref={buttonRef}
                                    type="button" 
                                    className="flex items-center space-x-2 text-sm rounded-full focus:ring-2 focus:ring-blue-300 dark:focus:ring-gray-600" 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    {userData?.profilePicture ? (
                                        <img 
                                            className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700" 
                                            src={userData.profilePicture} 
                                            alt="user photo" 
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white border-2 border-gray-200 dark:border-gray-700">
                                            {userData?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </button>
                                {isDropdownOpen && (
                                    <div 
                                        ref={dropdownRef}
                                        className="absolute right-0 top-10 z-50 my-4 w-56 text-base list-none bg-white/95 backdrop-blur-md divide-y divide-gray-100 rounded-xl shadow-2xl dark:bg-gray-700/95 dark:divide-gray-600 transform opacity-100 scale-100 transition-all duration-200 border border-white/20"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button"
                                    >
                                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-t-lg">
                                            <span className="block text-sm text-gray-900 dark:text-white font-semibold">
                                                {userData?.name || 'User Name'}
                                            </span>
                                            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                                                {userData?.email || 'user@email.com'}
                                            </span>
                                        </div>
                                        <ul className="py-2">
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        navigate('/profile')
                                                        setIsDropdownOpen(false)
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
                                                >
                                                    Profile
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        navigate('/dashboard')
                                                        setIsDropdownOpen(false)
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
                                                >
                                                    Dashboard
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        navigate('/settings')
                                                        setIsDropdownOpen(false)
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
                                                >
                                                    Settings
                                                </button>
                                            </li>
                                            <li className="border-t dark:border-gray-600">
                                                <LogoutBtn className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors duration-200" />
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        type="button" 
                        className="md:hidden inline-flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden py-2`}>
                    <ul className="flex flex-col space-y-2">
                        {navItems.map((item) => 
                            item.active ? (
                                <li key={item.name}>
                                    <button 
                                        onClick={() => {
                                            navigate(item.slug)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                        
                        {!authStatus && (
                            <div className="pt-2 space-y-2">
                                <Link 
                                    to="/login"
                                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup"
                                    className="block w-full text-left px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </ul>
                </div>
            </Container>
    )
}

export default Header