import {Container, Logo, LogoutBtn} from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'

function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const navItems = [
        {
            name: 'Home',
            slug: '/',
            active: true
        },
        {
            name: 'Login',
            slug: '/login',
            active: !authStatus
        },
        {
            name: 'Signup',
            slug: '/signup',
            active: !authStatus
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
        <nav className="bg-white border-gray-200 dark:bg-gray-900 py-2">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Logo className="h-6" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Your Logo</span>
                </Link>

                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
                    {authStatus ? (
                        <>
                            <button 
                                type="button" 
                                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className="sr-only">Open user menu</span>
                                {userData?.profilePicture ? (
                                    <img className="w-8 h-8 rounded-full" src={userData.profilePicture} alt="user photo" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        {userData?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-10 z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <div className="px-4 py-3">
                                        <span className="block text-sm text-gray-900 dark:text-white">
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
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
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
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
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
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
                                            >
                                                Settings
                                            </button>
                                        </li>
                                        <li>
                                            <LogoutBtn className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left" />
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : null}
                    
                    <button 
                        data-collapse-toggle="navbar-user" 
                        type="button" 
                        className="inline-flex items-center p-1 w-8 h-8 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                </div>

                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {navItems.map((item) => 
                            item.active ? (
                                <li key={item.name}>
                                    <button 
                                        onClick={() => navigate(item.slug)}
                                        className="block py-1 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header