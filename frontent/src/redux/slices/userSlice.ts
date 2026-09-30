import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardSummary, User } from "../../types/user";

type UserState = {
    users: User[];
    selectedUser: User | null;
    dashboard: DashboardSummary;
    loading: boolean;
    error: string | null;
    count: number
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
    count:0
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
            state.dashboard.blocked = action.payload.filter((user) => user.status === "Blocked" || user.status === "Inactive").length;
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
        }
    },
});

export const { setUsers, setSelectedUser, setLoading, setError, setDashboardSummary , setCountIncrement} = userSlice.actions;
export default userSlice.reducer;