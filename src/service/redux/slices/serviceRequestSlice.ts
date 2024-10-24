import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Location {
  lat: number;
  lng: number;
}

interface UserData {
  name: string;
  email: string;
  mobile: string;
  userImage: string;
}

interface ServiceRequest {
  location: Location;
  service: string;
  notes: string;
  userData: UserData;
  distance: number;
  expertId: string;
  totalAmount: number;
  serviceName: string;
  ratePerHour: number;
}

interface ServiceRequestState {
  serviceRequest: ServiceRequest | null;
}

const initialState: ServiceRequestState = {
  serviceRequest: null,
};

export const serviceRequestSlice = createSlice({
  name: "serviceRequest",
  initialState,
  reducers: {
    setServiceRequest: (state, action: PayloadAction<ServiceRequest>) => {
      state.serviceRequest = action.payload;
    },
    clearServiceRequest: (state) => {
      state.serviceRequest = null;
    },
  },
});

export const { setServiceRequest, clearServiceRequest } = serviceRequestSlice.actions;

export default serviceRequestSlice;
