// App.tsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import MovieTable from './components/MovieTable';
import MovieGraph from './components/MovieGraph';
import { login, getMovies } from './services/ApiService'
import { createHubConnection } from './services/SignalRService';
import { Box, Container } from '@mui/material';
import { Movie } from './models/types';
import VoteGraphExample from './components/VoteGraphExample';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [voteData, setVoteData] = useState<{ time: string; votes: number }[]>([]);
  const fakeVotesData = [
    { time: '2023-06-26T10:00:00', votes: 5 },
    { time: '2023-06-26T10:05:00', votes: 8 },
    { time: '2023-06-26T10:10:00', votes: 15 },
    { time: '2023-06-26T10:15:00', votes: 0 },
    { time: '2023-06-26T10:20:00', votes: 20 },
    { time: '2023-06-26T10:25:00', votes: 5 },
    { time: '2023-06-26T10:30:00', votes: 18 },
    { time: '2023-06-26T10:35:00', votes: 5 },
    { time: '2023-06-26T10:40:00', votes: 30 },
    { time: '2023-06-26T10:45:00', votes: 3 },
    { time: '2023-06-26T10:50:00', votes: 40 },
    { time: '2023-06-26T10:55:00', votes: 38 },
    { time: '2023-06-26T11:00:00', votes: 42 },
    { time: '2023-06-26T11:05:00', votes: 45 },
    { time: '2023-06-26T11:10:00', votes: 50 },
    { time: '2023-06-26T11:15:00', votes: 55 },
    { time: '2023-06-26T11:20:00', votes: 60 },
    { time: '2023-06-26T11:25:00', votes: 62 },
    { time: '2023-06-26T11:30:00', votes: 65 },
    { time: '2023-06-26T11:35:00', votes: 70 },
  ];
  useEffect(() => {


    const initialize = async () => {
      const token = await login();
      const movies = await getMovies(token);
      setMovies(movies.map((movie: any) => ({ ...movie, totalVotes: 0, lastUpdatedTime: '', positionChange: 'same' })));

      const connection = createHubConnection(token);
      connection.on('DataReceived', (data: any) => {
        const receivedData = data.map((item: any) => ({
          generatedTime: new Date(item.generatedTime).toLocaleString(),
          itemId: item.itemId,
          itemCount: item.itemCount,
        }));

        const updatedMovies = [...movies];
        receivedData.forEach((vote: any) => {
          const movie = updatedMovies.find(m => m.id === vote.itemId);
          if (movie) {
            movie.totalVotes += vote.itemCount;
            movie.lastUpdated = vote.generatedTime;
            // Add logic to determine positionChange
          }
        });

        setMovies(updatedMovies);
        setLastUpdateTime(new Date().toLocaleString());
        //////////////////////////////////////////////////////
        if (selectedMovie) {
          debugger
          const selectedMovieVotes = receivedData.filter((vote: { itemId: number; }) => vote.itemId === selectedMovie.id);
          setVoteData(prevData => [
            ...prevData,
            ...selectedMovieVotes.map((vote: { generatedTime: any; itemCount: any; }) => ({
              time: vote.generatedTime,
              votes: vote.itemCount,
            }))
          ].slice(-20)); 
        }
      });
         /////////////////////////////////////////////////////
      connection.start()
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));

      connection.onclose(() => setIsConnected(false));
    };

    initialize();
  }, []);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setVoteData([]); // Reset vote data for the selected movie
  };

  return (
    <Container>
      <Header connected={isConnected} lastUpdateTime={lastUpdateTime} />
      <VoteGraphExample votesData={fakeVotesData} />
      <Box mt={2}>
        <MovieTable movies={movies} onMovieSelect={handleMovieSelect} />
      </Box>
      {selectedMovie && (
        <Box mt={2}>
          <MovieGraph data={voteData} />
        </Box>
      )}
    </Container>
  );
};

export default App;

