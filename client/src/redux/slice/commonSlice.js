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
        showLoader: (state, action) => {
            state.isLoading = action.payload
        }
    }
})

export const { currentUserAuth,showLoader } = commonSlice.actions

export default commonSlice.reducer