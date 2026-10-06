import type { UserProfile } from "../types/user";
import { apiFetch } from "./api";


const Api_url = (import.meta.env.VITE_API_URL || import.meta.env.API_URL || "http://localhost:3000").replace(/\/$/, "");

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
    const response = await apiFetch(`${Api_url}/api/user/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if(!response) return
    return handleApiResponse(response);
};

export const updateUserProfile = async (data: Partial<UserProfile>, token?: string) => {
    const response = await apiFetch(`${Api_url}/api/user/profile`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });
    if(!response) return;
    return handleApiResponse(response);
};

export const changeUserPassword = async (data: ChangePasswordPayload, token?: string) => {
    const response = await apiFetch(`${Api_url}/api/user/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });
    if(!response) return
    return handleApiResponse(response);
};
export const deleteUserAccount = async(token: string):Promise<void> =>{
    const response = await apiFetch(`${Api_url}/api/user/account`,{
        method: "DELETE",
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
    if(!response) return;
    return handleApiResponse(response);
}
export type { UserProfile, ChangePasswordPayload };
