import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const PublicOnlyRoute = ()=>{
    const {isAuthenticated, user} = useAuth();
    if(isAuthenticated){
        return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace/>
    }
    return <Outlet/>
}
export default PublicOnlyRoute;