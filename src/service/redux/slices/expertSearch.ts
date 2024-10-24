import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
    isOpen: boolean;
}

const initialState: SearchState = {
    isOpen: false, 
}

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        startSearching: (state) => {
            state.isOpen = true; 
        },
        endSearching: (state) => {
            state.isOpen = false; 
        }
    }
});

export const { startSearching, endSearching } = searchSlice.actions;

export default searchSlice;
