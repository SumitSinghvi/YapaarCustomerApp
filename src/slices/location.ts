import { createSlice } from "@reduxjs/toolkit";

export interface Location {
  name: string | null;
  phoneNumber: string | null;
  placeName: string | null;
  placeId: string | null;
  houseNumberPlate: string | null;
  latitude: number | null;
  longitude: number | null;
  addressType: string | null;
}

const initialState = {
  pickup: {
    name: null,
    phoneNumber: null,
    placeName: "KP heights, nikol, Ahmedabad, Gujarat",
    placeId: null,
    houseNumberPlate: null,
    latitude: 23.032927179370382,
    longitude: 72.65921250098766,
    addressType: null,
  } as Location,
  dropoff: {
    name: null,
    phoneNumber: null,
    placeName: null,
    placeId: null,
    houseNumberPlate: null,
    latitude: null,
    longitude: null,
    addressType: null,
  } as Location,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setPickupLocation: (state, action) => {
      state.pickup = action.payload;
    },
    setDropoffLocation: (state, action) => {
      state.dropoff = action.payload;
    },
  },
});

export const { setDropoffLocation, setPickupLocation } = locationSlice.actions;

export default locationSlice.reducer;
