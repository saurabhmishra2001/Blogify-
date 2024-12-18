import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import authService from "../../appwrite/auth"
import { logout } from "../../store/authSlice"
import { Button } from "../ui/button"

function LogoutBtn(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            // Clear Appwrite session
            await authService.logout();

            // Clear browser cache
            if ('caches' in window) {
                // Delete all caches
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }

            // Clear local storage
            localStorage.clear();
            
            // Clear session storage
            sessionStorage.clear();

            // Update Redux state
            dispatch(logout());

            // Navigate to home page
            navigate('/', { replace: true });

            // Reload the page to ensure complete cleanup
            window.location.reload();
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    return(
        <Button 
            className="font-medium text-destructive hover:text-destructive/90 transition-colors flex items-center gap-2"
            variant="ghost"
            onClick={logoutHandler}
        >
            <span>Logout</span>
            <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
            </svg>
        </Button>
    )
}

export default LogoutBtn;