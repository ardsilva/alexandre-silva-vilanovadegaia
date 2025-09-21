import { createSlice } from '@reduxjs/toolkit';

// ISSUE: No duplicate checking when adding movies
const starredSlice = createSlice({
	name: 'starred',
	initialState: {
		starredMovies: [],
	},
	reducers: {
		starMovie: (state, action) => {
			state.starredMovies = [action.payload, ...state.starredMovies]; // Should check for duplicates
		},
		unstarMovie: (state, action) => {
			const indexOfId = state.starredMovies.findIndex(
				(key) => key.id === action.payload.id
			);
			state.starredMovies.splice(indexOfId, 1);
		},
		clearAllStarred: (state) => {
			state.starredMovies = [];
		},
	},
});

export default starredSlice;
