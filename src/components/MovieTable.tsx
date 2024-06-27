import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TextField, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import { Movie } from '../models/types';

interface MovieTableProps {
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
}

const MovieTable: React.FC<MovieTableProps> = ({ movies, onMovieSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);

  useEffect(() => {
    setFilteredMovies(
      movies.filter((movie) =>
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, movies]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Movie ID', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'totalVotes', headerName: 'Total Votes', width: 150 },
    { field: 'lastUpdatedTime', headerName: 'Last Updated', width: 200 },
    {
      field: 'positionChange',
      headerName: 'Icon',
      width: 150,
      renderCell: (params) => {
        const { value } = params;
        return value === 'up' ? (
          <ArrowUpwardIcon style={{ color: 'green' }} />
        ) : value === 'down' ? (
          <ArrowDownwardIcon style={{ color: 'red' }} />
        ) : (
          <RemoveIcon style={{ color: 'gray' }} />
        );
      },
    },
  ];

  return (
    <Box>
      <TextField
        label="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredMovies}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          onRowClick={(params) => onMovieSelect(params.row)}
        />
      </Box>
    </Box>
  );
};

export default MovieTable;
