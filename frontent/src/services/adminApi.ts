import type { DashboardSummary, User, UserRole, UserStatus } from "../types/user";

const apiUrl = (import.meta.env.VITE_API_URL || import.meta.env.API_URL || "http://localhost:3000").replace(/\/$/, "");
type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const request = async (path: string, token: string): Promise<unknown> => {
    const response = await fetch(`${apiUrl}${path}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const text = await response.text();
        let payload: unknown;
    try {
        payload = text ? JSON.parse(text) : {};
    } catch {
        payload = {};
    }

    if (!response.ok) {
        const message = isRecord(payload) ? payload.message ?? payload.error : undefined;
        throw new Error(typeof message === "string" ? message : `Request failed with status ${response.status}`);
    }

    return payload;
};

const requestWithBody = async (path: string, token: string, body: unknown, method = "POST"): Promise<unknown> => {
    const response = await fetch(`${apiUrl}${path}`, {
        method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const text = await response.text();
    let payload: unknown;
    try {
        payload = text ? JSON.parse(text) : {};
    } catch {
        payload = {};
    }
    if (!response.ok) {
        const message = isRecord(payload) ? payload.message ?? payload.error : undefined;
        throw new Error(typeof message === "string" ? message : `Request failed with status ${response.status}`);
    }
    return payload;
};

const normalizeUser = (value: unknown): User => {
    if (!isRecord(value)) {
        throw new Error("The server returned an invalid user record.");
    }

    const id = value.id ?? value._id;
    const roleValue = typeof value.role === "string" ? value.role.toLowerCase() : "";
    const role: UserRole | null = roleValue === "admin" || roleValue === "user" ? roleValue : null;

    if ((typeof id !== "string" && typeof id !== "number") || typeof value.name !== "string" || typeof value.email !== "string" || !role) {
        throw new Error("The server returned a user without the required id, name, email, or role.");
    }

    const statusValue = typeof value.status === "string" ? value.status.toLowerCase() : "";
    const statusMap: Record<string, UserStatus> = {
        active: "Active",
        blocked: "Blocked",
    };
    const status = statusMap[statusValue];

    return {
        id: String(id),
        name: value.name,
        email: value.email,
        role,
        ...(status ? { status } : {}),
        ...(typeof value.department === "string" ? { department: value.department } : {}),
        ...(typeof value.location === "string" ? { location: value.location } : {}),
        ...(typeof value.phone === "string" ? { phone: value.phone } : {}),
    };
};

const extractUsers = (payload: unknown): unknown[] => {
    if (Array.isArray(payload)) return payload;
    if (!isRecord(payload)) throw new Error("The server returned an invalid users response.");

    if (Array.isArray(payload.users)) return payload.users;
    if (Array.isArray(payload.data)) return payload.data;
    if (isRecord(payload.data) && Array.isArray(payload.data.users)) return payload.data.users;

    throw new Error("The server response did not include a users list.");
};

const extractSingleUser = (payload: unknown): unknown => {
    if (!isRecord(payload)) return payload;
    if (payload.user) return payload.user;
    if (payload.data) {
        if (isRecord(payload.data) && payload.data.user) return payload.data.user;
        return payload.data;
    }
    return payload;
};

export const getUsers = async (token: string): Promise<User[]> => {
    const payload = await request("/api/admin/users", token);
    return extractUsers(payload).map(normalizeUser);
};
export const getUserById = async (id: string, token: string): Promise<User> => {
    const payload = await request(`/api/admin/users/${encodeURIComponent(id)}`, token);
    return normalizeUser(extractSingleUser(payload));
};

export const createAdminUser = async (
    data: { name: string; email: string; password: string },
    token: string,
): Promise<User> => {
    const payload = await requestWithBody("/api/admin/users", token, data);
    return normalizeUser(extractSingleUser(payload));
};

export const updateAdminUser = async (
    id: string,
    data: Pick<User, "name" | "email" | "phone" | "role">,
    token: string,
): Promise<User> => {
    const payload = await requestWithBody(`/api/admin/users/${encodeURIComponent(id)}`, token, data, "PATCH");
    return normalizeUser(extractSingleUser(payload));
};

export const deleteAdminUser = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${apiUrl}/api/admin/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const text = await response.text();
    let payload: unknown;
    try {
        payload = text ? JSON.parse(text) : {};
    } catch {
        payload = {};
    }
    if (!response.ok) {
        const message = isRecord(payload) ? payload.message ?? payload.error : undefined;
        throw new Error(typeof message === "string" ? message : `Request failed with status ${response.status}`);
    }
};

export const getAdminDashboardSummary = async (token: string): Promise<DashboardSummary> => {
    const payload = await request("/api/admin/dashboard", token);
    const summary = isRecord(payload) && isRecord(payload.summary)
        ? payload.summary
        : isRecord(payload) && isRecord(payload.data)
            ? payload.data
            : payload;

    if (!isRecord(summary)) {
        throw new Error("The server returned an invalid dashboard response.");
    }

    const count = (...values: unknown[]) => {
        const value = values.find((candidate) => typeof candidate === "number" && Number.isFinite(candidate));
        return typeof value === "number" ? value : 0;
    };

    return {
        totalUsers: count(summary.totalUsers, summary.total),
        active: count(summary.active, summary.activeUsers),
        pending: count(summary.pending, summary.pendingUsers),
        blocked: count(summary.blocked, summary.blockedUsers, summary.inactiveUsers),
        activity: Array.isArray(summary.activity)
            ? summary.activity.filter((item): item is string => typeof item === "string")
            : [],
    };
};


export const toggleBlockUser = async(userId: string, newStatus: UserStatus, token: string)=>{
    try{
        const path = `${apiUrl}/api/admin/users/${encodeURIComponent(userId)}/block`;
        const response = await fetch(path,
            {
                method:"PATCH",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status:newStatus
                })
            }
        );
        const text = await response.text();
        let payload: unknown;
        try {
            payload = text ? JSON.parse(text) : {};
        } catch {
            payload = {};
        }
        if (!response.ok) {
            const message = isRecord(payload) ? payload.message ?? payload.error : undefined;
            throw new Error(typeof message === "string" ? message : `Request failed with status ${response.status}`);
        }
        return normalizeUser(isRecord(payload) ? payload.user : undefined);
    }
    catch(err){
        console.log(`failed to toggle the user`,err);
        throw err;
    }
}
