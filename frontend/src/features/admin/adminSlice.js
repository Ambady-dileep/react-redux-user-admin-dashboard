import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/axios";

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (search = "", thunkAPI) => {
    try {
      const res = await API.get(`/users/admin/users/?search=${search}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/users/admin/users/${id}/delete/`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      

      .addCase(fetchUsers.fulfilled, (state, action) => {
            console.log("RAW PAYLOAD:", action.payload);
            state.loading = false;
            state.users = action.payload.results ?? action.payload; 
            state.totalCount = action.payload.count ?? action.payload.length;
        })

        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = "Failed to fetch users"; 
        })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user.id !== action.payload
        );
      });
  },
});

export default adminSlice.reducer;