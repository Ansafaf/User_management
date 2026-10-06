export type UserRole = "user" | "admin";
export type UserStatus = "Active" | "Blocked";

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status?: UserStatus;
    profileImage?: string;
    phone?: string;
};

export type AuthUser = Pick<User, "id" | "name" | "email" | "role" | "phone" | "profileImage">;

export type DashboardSummary = {
    totalUsers: number;
    active: number;
    pending: number;
    blocked: number;
    activity: string[];
};

export type UserProfile = Pick<User, "id" | "name" | "email" | "role" | "phone"> & {
    profileImage?: string;
};
