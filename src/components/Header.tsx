import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { green, red } from '@mui/material/colors';

interface HeaderProps {
  connected: boolean;
  lastUpdateTime: string;
}

const Header: React.FC<HeaderProps> = ({ connected, lastUpdateTime }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Typography variant="h6">Movies Rating System</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Chip
            label={connected ? 'Connected' : 'Disconnected'}
            style={{
              backgroundColor: connected ? green[500] : red[500],
              color: 'white',
            }}
          />
        </Box>
        <Box ml={2}>
          <Typography variant="body1">Last update: {lastUpdateTime}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
