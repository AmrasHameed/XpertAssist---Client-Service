import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";

interface SearchState {
  isOpen: boolean;
}

const initialState: SearchState = {
  isOpen: false,
};


export const startSearchWithTimer= (delay: number) => (dispatch: AppDispatch) => {
  dispatch(startSearching());  
  setTimeout(() => {
    dispatch(endSearching()); 
  }, delay);
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    startSearching: (state) => {
      state.isOpen = true;
    },
    endSearching: (state) => {
      state.isOpen = false;
    },
  },
});

export const { startSearching, endSearching } = searchSlice.actions;

export default searchSlice;
