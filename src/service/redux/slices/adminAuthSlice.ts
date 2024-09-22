import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminAuthState {
    name: string;
    loggedIn: boolean;
}

const initialState: AdminAuthState = {
    name: "",
    loggedIn: false,
}

export const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
       adminLogin: ((state, action: PayloadAction<AdminAuthState>) => { 
            state.name = action.payload.name;
            state.loggedIn = action.payload.loggedIn;
        }),
        adminLogout: (state => {
            state.name = "";
            state.loggedIn = false;
            localStorage.removeItem('adminToken')
        })
    }
})

export const { adminLogin, adminLogout } = adminAuthSlice.actions;

export default adminAuthSlice;