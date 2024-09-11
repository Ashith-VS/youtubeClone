import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentVideo: {}
}

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        fetchSuccess: (state, action) => {
            state.currentVideo = action.payload;
        },
    }
})

export const { fetchSuccess} = videoSlice.actions

export default videoSlice.reducer