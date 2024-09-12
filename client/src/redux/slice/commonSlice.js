import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    isLoading: false
}

export const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        currentUserAuth: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
      state.currentUser = null; // Clear the user data
    },
        showLoader: (state, action) => {
            state.isLoading = action.payload
        }
    }
})

export const { currentUserAuth,logout,showLoader } = commonSlice.actions

export default commonSlice.reducer