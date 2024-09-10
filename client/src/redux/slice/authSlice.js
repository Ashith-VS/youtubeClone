import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    isLoading: false,
    error: null
}

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.currentUser = null;
        },
        logout: (state) => {
            // return initialState 
            state.currentUser = null;
            state.error = null;
            state.isLoading = false;
        },
        showLoader: (state, action) => {
            state.isLoading = action.payload
        }
    }
})

export const { loginSuccess, loginFailure, logout, showLoader } = userSlice.actions

export default userSlice.reducer