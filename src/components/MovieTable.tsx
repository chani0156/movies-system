import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Box, TableSortLabel } from '@mui/material';
import { Movie } from '../models/types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
interface MovieTableProps {
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
}

const MovieTable: React.FC<MovieTableProps> = ({ movies, onMovieSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedMovies, setSortedMovies] = useState<Movie[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<keyof Movie>('id');

  useEffect(() => {
    const filteredMovies = movies.filter((movie) =>
      movie.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSortedMovies(filteredMovies);
  }, [searchTerm, movies]);

  const handleSort = (column: keyof Movie) => {
    const isAsc = sortColumn === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
    const sorted = [...sortedMovies].sort((a, b) => {
      if (a[column] < b[column]) return sortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedMovies(sorted);
  };

  return (
    <Box>
      <TextField label="Search by title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth margin="normal" />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel active={sortColumn === 'id'} direction={sortOrder} onClick={() => handleSort('id')}>
                Movie ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active={sortColumn === 'description'} direction={sortOrder} onClick={() => handleSort('description')}>
                Description
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active={sortColumn === 'totalVotes'} direction={sortOrder} onClick={() => handleSort('totalVotes')}>
                Total Votes
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active={sortColumn === 'lastUpdated'} direction={sortOrder} onClick={() => handleSort('lastUpdated')}>
                Last Updated
              </TableSortLabel>
            </TableCell>
            <TableCell>Icon</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedMovies.map((movie) => (
            <TableRow key={movie.id} onClick={() => onMovieSelect(movie)}>
              <TableCell>{movie.id}</TableCell>
              <TableCell>{movie.description}</TableCell>
              <TableCell>{movie.totalVotes}</TableCell>
              <TableCell>{movie.lastUpdated}</TableCell>
              <TableCell>
                {/* Implement icon logic here */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default MovieTable;
