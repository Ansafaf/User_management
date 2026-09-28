const Api_url = import.meta.env.API_URL;

type loginType={
    email: string,password: string
}
export const loginUser = async(data:loginType)=>{
    const response = await fetch(`${Api_url}/auth/login`,{
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data),
    });
    return response.json();
}