import { VoteDataAction, VoteDataState } from "../models/types";

const ADD_VOTE_DATA = 'ADD_VOTE_DATA';

const voteDataReducer = (state: VoteDataState, action: VoteDataAction): VoteDataState => {
  switch (action.type) {
    case ADD_VOTE_DATA: {
        debugger
      const { movieId, newData } = action.payload;
      const movieData = state[movieId] || [];
      const updatedMovieData = [...movieData, ...newData].slice(-20);
      return {
        ...state,
        [movieId]: updatedMovieData,
      };
    }
    default:
      return state;
  }
};

export { ADD_VOTE_DATA, voteDataReducer };
