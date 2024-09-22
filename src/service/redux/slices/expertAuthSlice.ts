import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExpertAuthState {
    expert: string;
    expertId: string;
    image: string;
    loggedIn: boolean;
}

const initialState: ExpertAuthState = {
    expert: "",
    expertId: "",
    image: "",
    loggedIn: false,
}

export const expertAuthSlice = createSlice({
    name: "expertAuth",
    initialState,
    reducers: {
        expertLogin: ((state, action: PayloadAction<ExpertAuthState>) => { 
            state.expert = action.payload.expert;
            state.expertId = action.payload.expertId;
            state.image = action.payload.image;
            state.loggedIn = action.payload.loggedIn;
        }),
        expertLogout: (state => {
            state.expert = "";
            state.expertId = "";
            state.image = "";
            state.loggedIn = false;
            localStorage.removeItem('expertToken')
            localStorage.removeItem('expertRefreshToken')
        })
    }
})

export const { expertLogin, expertLogout } = expertAuthSlice.actions;

export default expertAuthSlice;