export type UserStatus = "Active" | "Pending" | "Inactive";

export type User = {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    status: UserStatus;
    department?: string;
    location?: string;
    phone?: string;
};