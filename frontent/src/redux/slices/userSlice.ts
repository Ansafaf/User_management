import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user";

type DashboardSummary = {
    totalUsers: number;
    active: number;
    pending: number;
    blocked: number;
    activity: string[];
};

type UserState = {
    users: User[];
    selectedUser: User | null;
    dashboard: DashboardSummary;
    loading: boolean;
    error: string | null;
};

const initialUsers: User[] = [
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

const initialState: UserState = {
    users: initialUsers,
    selectedUser: initialUsers[0],
    dashboard: {
        totalUsers: initialUsers.length,
        active: 1,
        pending: 1,
        blocked: 1,
        activity: [
            "John Doe updated profile",
            "Maria Chen was approved",
            "Team access renewed",
        ],
    },
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
            state.dashboard.totalUsers = action.payload.length;
            state.dashboard.active = action.payload.filter((user) => user.status === "Active").length;
            state.dashboard.pending = action.payload.filter((user) => user.status === "Pending").length;
            state.dashboard.blocked = action.payload.filter((user) => user.status === "Inactive").length;
        },
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setDashboardSummary: (state, action: PayloadAction<DashboardSummary>) => {
            state.dashboard = action.payload;
        },
    },
});

export const { setUsers, setSelectedUser, setLoading, setError, setDashboardSummary } = userSlice.actions;
export default userSlice.reducer;