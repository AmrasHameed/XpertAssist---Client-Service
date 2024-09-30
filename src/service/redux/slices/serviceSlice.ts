import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Service {
    id: string;
    name: string;
    description: string;
    price: string;
    serviceImage: string;
}

interface ServicesState {
    services: Service[];
}

const initialState: ServicesState = {
    services: [],
}

export const servicesSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        setServices: (state, action: PayloadAction<Service[]>) => {
            state.services = action.payload;
        },
        clearServices: (state) => {
            state.services = [];
        }
    }
})

export const { setServices, clearServices } = servicesSlice.actions;

export default servicesSlice;
