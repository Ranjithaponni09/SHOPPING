import { createSlice } from '@reduxjs/toolkit';

const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const user = localStorage.getItem('user');

const initialState = {
  token: accessToken || null,
  refreshToken: refreshToken || null,
  user: user ? JSON.parse(user) : null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state){ state.loading = true; state.error = null },
    loginSuccess(state, action){
      state.loading = false;
      const { token, refreshToken, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken || state.refreshToken;
      state.user = user;
      localStorage.setItem('accessToken', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    loginFailure(state, action){ state.loading = false; state.error = action.payload },
    logout(state){
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
