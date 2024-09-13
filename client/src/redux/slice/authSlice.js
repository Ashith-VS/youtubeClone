import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    isLoading: false,
}

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        RegistrationFailure:(state, action) => {
            state.error = action.payload?.message;
        },
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.error = action.payload?.message;
            state.currentUser = null;
        },
        logout: (state) => {
            // return initialState 
            state.currentUser = null;
            state.error = null;
            state.isLoading = false;
        }
    }
})

export const { RegistrationFailure,loginSuccess, loginFailure, logout, showLoader } = userSlice.actions

export default userSlice.reducer