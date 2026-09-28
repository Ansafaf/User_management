import { useState } from "react";
import { loginUser } from "../../services/authApi";
    import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent) =>{
            e.preventDefault();
        try{
            const data = await loginUser({email, password});
            console.log(data);
            navigate('/dashboard');
        }
        catch(err){
            console.log(err);
        }
    }
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>Login</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e)=> setEmail(e.target.value)}/>
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Enter password"  value={password} onChange={(e)=> setPassword(e.target.value)}/>
          </label>
          <button type="submit" className="primary-btn">Sign In</button>
        </form>
      </div>
    </div>
  )
}

export default Login;