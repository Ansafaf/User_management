import type { User } from "../types/user";

const mockUsers: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@company.com",
        role: "admin",
        status: "Active",
        department: "Operations",
        location: "New York",
        phone: "+1 555 789 1234",
    },
    {
        id: "2",
        name: "Maria Chen",
        email: "maria@company.com",
        role: "user",
        status: "Pending",
        department: "Engineering",
        location: "Seattle",
        phone: "+1 555 123 4567",
    },
    {
        id: "3",
        name: "Ava Patel",
        email: "ava@company.com",
        role: "user",
        status: "Inactive",
        department: "Support",
        location: "Austin",
        phone: "+1 555 987 6543",
    },
];

export const getUsers = async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUsers;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUsers.find((user) => user.id === id);
};

export const getAdminDashboardSummary = async () => ({
    totalUsers: mockUsers.length,
    active: mockUsers.filter((user) => user.status === "Active").length,
    pending: mockUsers.filter((user) => user.status === "Pending").length,
    blocked: mockUsers.filter((user) => user.status === "Inactive").length,
    activity: [
        "John Doe updated profile",
        "Maria Chen was approved",
        "Team access renewed",
    ],
});
