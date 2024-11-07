import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VehicleState {
  vehicleType: string;
  goodsType: string;
  fairPrice: number;
}

const initialState: VehicleState = {
  vehicleType: "",
  goodsType: "",
  fairPrice: 0,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    setVehicleType(state, action: PayloadAction<string>) {
      state.vehicleType = action.payload;
    },
    setGoodsType(state, action: PayloadAction<string>) {
      state.goodsType = action.payload;
    },
    setFairPrice(state, action: PayloadAction<number>) {
      state.fairPrice = action.payload;
    },
  },
});

export const { setVehicleType, setGoodsType, setFairPrice } =
  vehicleSlice.actions;

export default vehicleSlice.reducer;
