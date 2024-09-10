import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentVideo: {}
}

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideo: (state, action) => {
            state.currentVideo = action.payload;
        },
    }
})

export const { setVideo} = videoSlice.actions

export default videoSlice.reducer