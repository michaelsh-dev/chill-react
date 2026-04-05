import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  myList: [],
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    setMyList: (state, action) => {
      state.myList = action.payload;
    },
    addToMyList: (state, action) => {
      state.myList.push(action.payload);
    },
    removeFromMyList: (state, action) => {
      state.myList = state.myList.filter(
        (item) => item.id !== action.payload
      );
    },
    updateMyList: (state, action) => {
      state.myList = state.myList.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
  },
});

export const {
  setMovies,
  setMyList,
  addToMyList,
  removeFromMyList,
  updateMyList,
} = movieSlice.actions;

export default movieSlice.reducer;