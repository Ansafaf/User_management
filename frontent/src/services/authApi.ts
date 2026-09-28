const Api_url = (import.meta.env.VITE_API_URL || import.meta.env.API_URL || "http://localhost:3000").replace(/\/$/, "");

type LoginType = {
    email: string;
    password: string;
}

type RegisterType = {
    name: string;
    email: string;
    password: string;
}

const handleApiResponse = async (response: Response) => {
    const text = await response.text();

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", text);

    let payload;

    try {
        payload = JSON.parse(text);
    } catch {
        payload = {};
    }

    if (!response.ok) {
        throw new Error(
            payload?.message ||
            payload?.error ||
            `Request failed with status ${response.status}`
        );
    }

    return payload;
};

export const loginUser = async (data: LoginType) => {
    const response = await fetch(`${Api_url}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return handleApiResponse(response);
};

export const registerUser = async (data: RegisterType) => {
    const response = await fetch(`${Api_url}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return handleApiResponse(response);
};