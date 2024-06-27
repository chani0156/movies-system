import React from 'react';
import { Box, Modal, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MovieGraph from './MovieGraph';
import { VoteData } from '../models/types';

interface MovieDialogProps {
    open: boolean;
    onClose: () => void;
    voteData: VoteData[];
}

const MovieDialog: React.FC<MovieDialogProps> = ({ open, onClose, voteData }) => {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={onClose}
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
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <MovieGraph data={voteData} />
                </Box>
            </Fade>
        </Modal>
    );
};

export default MovieDialog;
