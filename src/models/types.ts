export interface Movie {
  id: number;
  description: string;
  totalVotes: number;
  lastUpdatedTime: string;
  positionChange: 'up' | 'down' | 'same';
}
export interface Vote {
  generatedTime: string;
  itemId: number;
  itemCount: number;
}

export interface LoginResponse {
  token: string;
}
export interface VoteData {
  time: string;
  votes: number;
}

export interface VoteDataAction {
  type: 'ADD_VOTE_DATA';
  payload: {
    movieId: number;
    newData: VoteData[];
  };
}
export type VoteDataState = {
  [movieId: number]: VoteData[];
};







