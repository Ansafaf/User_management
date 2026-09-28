const Api_url = (import.meta.env.VITE_API_URL || import.meta.env.API_URL || "http://localhost:3000").replace(/\/$/, "");

type UserProfile = {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    location?: string;
    role?: "user" | "admin";
};

type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const handleApiResponse = async (response: Response) => {
    const text = await response.text();
    let payload: any = {};

    try {
        payload = text ? JSON.parse(text) : {};
    } catch {
        payload = {};
    }

    if (!response.ok) {
        throw new Error(payload?.message || payload?.error || `Request failed with status ${response.status}`);
    }

    return payload;
};

export const getUserProfile = async (token?: string) => {
    const response = await fetch(`${Api_url}/api/user/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    return handleApiResponse(response);
};

export const updateUserProfile = async (data: Partial<UserProfile>, token?: string) => {
    const response = await fetch(`${Api_url}/api/user/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });

    return handleApiResponse(response);
};

export const changeUserPassword = async (data: ChangePasswordPayload, token?: string) => {
    const response = await fetch(`${Api_url}/api/user/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });

    return handleApiResponse(response);
};

export type { UserProfile, ChangePasswordPayload };
