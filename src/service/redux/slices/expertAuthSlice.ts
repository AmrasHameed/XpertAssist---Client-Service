import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExpertAuthState {
    expert?: string;
    expertId?: string;
    email?: string;
    service?: string;
    mobile?: string;
    image?: string;
    isVerified?: string;
    loggedIn?: boolean;
}

const initialState: ExpertAuthState = {
    expert: "",
    expertId: "",
    email: "",
    service: "",
    mobile: "",
    image: "",
    isVerified: '',
    loggedIn: false,
}

export const expertAuthSlice = createSlice({
    name: "expertAuth",
    initialState,
    reducers: {
        expertLogin: ((state, action: PayloadAction<ExpertAuthState>) => { 
            state.expert = action.payload.expert;
            state.expertId = action.payload.expertId;
            state.email = action.payload.email;
            state.service = action.payload.service;
            state.mobile = action.payload.mobile;
            state.image = action.payload.image;
            state.isVerified = action.payload.isVerified;
            state.loggedIn = action.payload.loggedIn;
        }),
        expertLogout: (state => {
            state.expert = "";
            state.expertId = "";
            state.email = "";
            state.service = "";
            state.mobile = "";
            state.image = "";
            state.isVerified = '';
            state.loggedIn = false;
            localStorage.removeItem('expertToken')
            localStorage.removeItem('expertRefreshToken')
        })
    }
})

export const { expertLogin, expertLogout } = expertAuthSlice.actions;

export default expertAuthSlice;