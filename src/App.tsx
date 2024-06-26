import React, { useEffect, useState, useReducer } from 'react';
import Header from './components/Header';
import MovieTable from './components/MovieTable';
import MovieGraph from './components/MovieGraph';
import { login, getMovies } from './services/ApiService';
import { createHubConnection } from './services/SignalRService';
import { Box, Container, Modal, Backdrop, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Movie, Vote } from './models/types';
import { voteDataReducer } from './reducers/voteDataReducer';

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
      connection.on('DataReceived', (data: any) => {
        debugger
        const receivedData: Vote[] = [];

        data.forEach((item: { itemId: any; generatedTime: string | number | Date; itemCount: any; }) => {
          const existingVote = receivedData.find(vote => vote.itemId === item.itemId && vote.generatedTime === new Date(item.generatedTime).toLocaleString());
          if (existingVote) {
            existingVote.itemCount += item.itemCount;
          } else {
            receivedData.push({
              generatedTime: new Date(item.generatedTime).toLocaleString(),
              itemId: item.itemId,
              itemCount: item.itemCount,
            });
          }
        });

        const updatedMovies = movies.map((movie: { id: any; totalVotes: any; lastUpdatedTime: string; }) => {
          const vote = receivedData.find(v => v.itemId === movie.id);
          if (vote) {
            const time = new Date(vote.generatedTime).toLocaleString();
            movie.totalVotes += vote.itemCount;
            movie.lastUpdatedTime = time;

            dispatch({
              type: ADD_VOTE_DATA,
              payload: {
                movieId: vote.itemId,
                newData: [{ time, votes: vote.itemCount }]
              }
            });
          }
          return movie;
        });

        setMovies(updatedMovies);
        setLastUpdateTime(new Date().toLocaleString());
      });

      connection.start()
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));

      connection.onclose(() => setIsConnected(false));
    };

    initialize();
  }, []);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Container>
      <Header connected={isConnected} lastUpdateTime={lastUpdateTime} />
      <Box mt={2}>
        <MovieTable movies={movies} onMovieSelect={handleMovieSelect} />
      </Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: '80%', 
              height: '80%', 
              bgcolor: 'background.paper', 
              boxShadow: 24, 
              p: 4,
              overflow: 'auto' 
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            {selectedMovie && <MovieGraph data={voteData[selectedMovie.id] || []} />}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default App;
