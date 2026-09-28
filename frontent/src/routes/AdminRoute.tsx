import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const AdminRoute = ()=>{
    const {user} = useAuth();

    if(user?.role !== "admin"){
        return <Navigate to="/dashboard" replace/>
    }
    return <Outlet/>
}
export default AdminRoute;