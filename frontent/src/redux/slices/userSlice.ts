import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardSummary, User } from "../../types/user";

type UserState = {
    users: User[];
    selectedUser: User | null;
    dashboard: DashboardSummary;
    loading: boolean;
    error: string | null;
    count: number
    avgPrice: number
};


const initialState: UserState = {
    users: [],
    selectedUser: null,
    dashboard: {
        totalUsers: 0,
        active: 0,
        pending: 0,
        blocked: 0,
        activity: [],
    },
    loading: false,
    error: null,
    count:0,
    avgPrice: 0
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex((user) => user.id === action.payload.id);
            if (index < 0) return;
            const previous = state.users[index];
            if (previous.status !== action.payload.status) {
                if (previous.status === "Active") state.dashboard.active = Math.max(0, state.dashboard.active - 1);
                if (previous.status === "Blocked") state.dashboard.blocked = Math.max(0, state.dashboard.blocked - 1);
                if (action.payload.status === "Active") state.dashboard.active += 1;
                if (action.payload.status === "Blocked") state.dashboard.blocked += 1;
            }
            state.users[index] = action.payload;
        },
        removeUser: (state, action: PayloadAction<string>) => {
            const user = state.users.find((item) => item.id === action.payload);
            if (!user) return;
            state.users = state.users.filter((item) => item.id !== action.payload);
            state.dashboard.totalUsers = Math.max(0, state.dashboard.totalUsers - 1);
            if (user.status === "Active") state.dashboard.active = Math.max(0, state.dashboard.active - 1);
            if (user.status === "Blocked") state.dashboard.blocked = Math.max(0, state.dashboard.blocked - 1);
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
        setCountIncrement: (state)=>{
            state.count += 1;
        },
        setAverage: (state, action: PayloadAction<number>)=>{
            state.avgPrice = action.payload;
        }
    },
});

export const { setUsers, setAverage,updateUser, removeUser, setSelectedUser, setLoading, setError, setDashboardSummary , setCountIncrement} = userSlice.actions;
export default userSlice.reducer;
