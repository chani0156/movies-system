// App.tsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import MovieTable from './components/MovieTable';
import MovieGraph from './components/MovieGraph';
import { login, getMovies } from './services/ApiService'
import { setupSignalRConnection } from './services/SignalRService';
import { Box, Container } from '@mui/material';

const App: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [votes, setVotes] = useState<{ time: string; count: number }[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastReceiveTime, setLastReceiveTime] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        debugger
        const token = await login();
        const initialMovies = await getMovies(token);
        setMovies(initialMovies);
        const connection = setupSignalRConnection(token, onDataReceived);
        return connection;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData().then((connection) => {
      if (connection) {
        connection.onclose(() => setIsConnected(false));
        connection.onreconnected(() => setIsConnected(true));
      }
    });
  }, []);

  const onDataReceived = (data: any) => {
    const formattedTime = new Date(data.generatedTime).toLocaleString();
    setLastReceiveTime(formattedTime);

    const updatedMovies = movies.map((movie: any) => {
      if (movie.id === data.itemId) {
        return {
          ...movie,
          totalVotes: movie.totalVotes + data.itemCount,
          lastUpdatedTime: formattedTime,
          icon: calculateIcon(movie.totalVotes, movie.totalVotes + data.itemCount),
        };
      }
      return movie;
    });

    setMovies(updatedMovies);
  };

  const calculateIcon = (oldCount: number, newCount: number): string => {
    if (newCount > oldCount) {
      return 'up'; // your icon for up
    } else if (newCount < oldCount) {
      return 'down'; // your icon for down
    } else {
      return 'same'; // your icon for no change
    }
  };





  const handleMovieSelect = (movieId: number) => {
    const selected = movies.find((movie: any) => movie.id === movieId);
    if (selected) {
      setSelectedMovie(selected.id);
      const votesData = movies
        .find((movie: any) => movie.id === movieId)
        ?.votes.slice(-20)
        .map((vote: any) => ({
          time: new Date(vote.time).toLocaleString(),
          count: vote.count,
        }));
      setVotes(votesData || []);
    }
  };

  return (
    <div>
     <Container>
      <Header connected={isConnected} lastUpdateTime ={lastReceiveTime} />
      <Box mt={4}>
        <MovieTable movies={movies} onMovieSelect={handleMovieSelect} />
        {/* {selectedMovieVotes.length > 0 && <MovieGraph votes={selectedMovieVotes} />} */}
      </Box>
    </Container>
    </div>
  );
};

export default App;
