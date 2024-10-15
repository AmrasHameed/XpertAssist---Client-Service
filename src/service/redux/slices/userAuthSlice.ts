import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserAuthState {
    user?: string;
    userId?: string;
    image?: string;
    email?: string;
    mobile?: string;
    loggedIn?: boolean;
}

const initialState: UserAuthState = {
    user: "",
    userId: "",
    image: "",
    email: "",
    mobile: "",
    loggedIn: false,
}

export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLogin: ((state, action: PayloadAction<UserAuthState>) => { 
            state.user = action.payload.user;
            state.userId = action.payload.userId;
            state.image = action.payload.image;
            state.email = action.payload.email;
            state.mobile = action.payload.mobile;
            state.loggedIn = action.payload.loggedIn;
        }),
        userLogout: (state => {
            state.user = "";
            state.userId = "";
            state.image = "";
            state.email = "";
            state.mobile = "";
            state.loggedIn = false;
            localStorage.removeItem('userToken')
            localStorage.removeItem('refreshToken')
        })
    }
})

export const { userLogin, userLogout } = userAuthSlice.actions;

export default userAuthSlice;