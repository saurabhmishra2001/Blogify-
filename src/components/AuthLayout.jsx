import { useEffect,useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"


export default function Protected({children,authentication = true}){
    const navigate = useNavigate();
    const [loader,setLoader] = useState(true);

    const authStatus = useSelector(state => state.auth.status);

    useEffect(() => {
        // ToDo : Make it more easy to understand
        if(authentication && authStatus !== authentication){
            navigate('/login')
        }else if(!authentication && authStatus !== authentication){
            navigate('/')
        
        }
        setLoader(false)

    },[authStatus,navigate,authentication])
    return loader ? (
        <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-lg shadow-primary/20"></div>
        </div>
    ) : <>{children}</>
}