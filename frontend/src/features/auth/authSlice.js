import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, getProfile } from "./authAPI";

export const login = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            return await loginUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, thunkAPI) => {
    try {
      return await getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { detail: "Network error" });
    }
  }
);

const initialState = {
    user:null,
    access:localStorage.getItem("access") || null,
    refresh:localStorage.getItem("refresh") || null,
    loading: false,
    error: null,
    initialized: !localStorage.getItem("access"),
};

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers : {
        logout: (state) => {
            state.user = null;
            state.access = null;
            state.refresh = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {   
            state.loading = false;
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;

            localStorage.setItem("access", action.payload.access);
            localStorage.setItem("refresh", action.payload.refresh);
            })
            .addCase(fetchProfile.pending, (state) => {
                state.initialized = false;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            state.initialized = true;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.user = null;
                state.initialized = true; 
            })
            .addCase(login.rejected, (state, action) => {  
            state.loading = false;
            state.error = action.payload;
            });
        }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;