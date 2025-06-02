import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
};

export const addressBookSlice = createSlice({
  name: "address",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      const newAddress = action.payload;
      const existingAddress = state.addresses.find(
        (value) =>
          value.id === newAddress.id &&
          value.firstName === newAddress.firstName &&
          value.lastName === newAddress.lastName,
      );
      if (!existingAddress) {
        state.addresses.push(newAddress);
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      const newAddresses = state.addresses.filter(
        (value) => value.id !== action.payload,
      );

      state.addresses = newAddresses;
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.addressBook.addresses;

export default addressBookSlice.reducer;
