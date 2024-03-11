import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  userData: null,
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const {setData} = apiSlice.actions;

export default apiSlice.reducer;
