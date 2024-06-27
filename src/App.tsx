import React, { useEffect, useState, useReducer, useCallback } from 'react';
import Header from './components/Header';
import MovieTable from './components/MovieTable';
import { login, getMovies } from './services/ApiService';
import { createHubConnection } from './services/SignalRService';
import { Box, Container } from '@mui/material';
import {  Movie, Vote } from './models/types';
import { voteDataReducer } from './reducers/voteDataReducer';
import MovieDialog from './components/MovieDialog';

const ADD_VOTE_DATA = 'ADD_VOTE_DATA';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [voteData, dispatch] = useReducer(voteDataReducer, {});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const token = await login();
      const movies = await getMovies(token);
      setMovies(movies.map((movie: any) => ({
        ...movie,
        totalVotes: 0,
        lastUpdatedTime: '',
        positionChange: 'same'
      })));

      const connection = createHubConnection(token);
      connection.on('DataReceived', (data: any) => handleDataReceived(data, movies));

      connection.start()
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));

      connection.onclose(() => setIsConnected(false));
    };

    initialize();
  }, []);

  const handleDataReceived = (data: Vote [], movies: Movie[]) => {
    const receivedData: Vote[] = [];

    data.forEach((item) => {
      const time = new Date(item.generatedTime).toLocaleString();
      const existingVote = receivedData.find(vote => vote.itemId === item.itemId && vote.generatedTime === time);
      if (existingVote) {
        existingVote.itemCount += item.itemCount;
      } else {
        receivedData.push({
          generatedTime: time,
          itemId: item.itemId,
          itemCount: item.itemCount,
        });
      }
    });

    const previousState = [...movies];

    const updatedMovies = movies.map((movie: Movie) => {
      const vote = receivedData.find(v => v.itemId === movie.id);
      if (vote) {
        movie.totalVotes += vote.itemCount;
        movie.lastUpdatedTime = vote.generatedTime;
        dispatch({
          type: ADD_VOTE_DATA,
          payload: {
            movieId: vote.itemId,
            newData: [{ time: vote.generatedTime, votes: vote.itemCount }]
          }
        });
      }
      return movie;
    });

    movies.sort((a, b) => b.totalVotes - a.totalVotes);
    updatedMovies.sort((a, b) => b.totalVotes - a.totalVotes);

    updatedMovies.forEach((movie, index) => {
      const previousIndex = previousState.findIndex(m => m.id === movie.id);
      if (previousIndex > index) {
        movie.positionChange = 'up';
      } else if (previousIndex < index) {
        movie.positionChange = 'down';
      } else {
        movie.positionChange = 'same';
      }
    });

    setMovies(updatedMovies);
    setLastUpdateTime(new Date().toLocaleString());
  };



  const handleMovieSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedMovie(null);
  }, []);

  return (
    <Container>
      <Header connected={isConnected} lastUpdateTime={lastUpdateTime} />
      <Box mt={2}>
        <MovieTable movies={movies} onMovieSelect={handleMovieSelect} />
      </Box>
      {selectedMovie && (
        <MovieDialog
          open={open}
          onClose={handleClose}
          voteData={voteData[selectedMovie.id] || []}
        />
      )}
    </Container>
  );
};

export default App;
