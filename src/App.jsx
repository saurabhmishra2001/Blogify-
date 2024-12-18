import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import authService from "./appwrite/auth"
import { login,logout } from './store/authSlice'
import {Header,Footer} from './components'
import {Outlet} from 'react-router-dom'
import './App.css'

function App() {
  const [loading,setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {

      if (userData){
        dispatch(login(userData)) // {userData}
      }
      else{
        dispatch(logout())
      }

    })
    .finally(() => setLoading(false))
  },[])


  return !loading ? (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default App
