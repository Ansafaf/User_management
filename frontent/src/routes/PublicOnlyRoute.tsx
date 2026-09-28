import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const PublicOnlyRoute = ()=>{
    const {isAuthenticated} = useAuth();
    if(isAuthenticated){
        return <Navigate to="/dashboard" replace/>
    }
    return <Outlet/>
}
export default PublicOnlyRoute;