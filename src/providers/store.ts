import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import locationReducer from "../slices/location";
import vehicleReducer from "../slices/vehicle";

const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    vehicle: vehicleReducer,
  },
});

export default store;
