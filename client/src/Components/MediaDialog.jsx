// MediaDialog.js
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Typography,
    TableContainer,
    Paper,
    TextField,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../Common/api';

const MediaDialog = ({ open, onClose, onMediaAdded }) => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTitle, setNewTitle] = useState('');
    const [newBannerImage, setNewBannerImage] = useState(null); // Updated to store file
    const [newVideoPath, setNewVideoPath] = useState(null); // Updated to store file

    const fetchMedia = async () => {
        try {
            const res = await api.getMedia(); 
            setMedia(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to fetch media!");
        }
    };

    useEffect(() => {
        if (open) {
            fetchMedia();
        }
    }, [open]);

    const handleAddMedia = async () => {
        try {
            const formData = new FormData();
            formData.append('title', newTitle);
            if (newBannerImage) {
                formData.append('file', newBannerImage);
            }
            if (newVideoPath) {
                formData.append('file', newVideoPath);
            }
            console.log(formData)
            await api.addMedia(formData);
            toast.success("Media added successfully!");
            fetchMedia(); 
            onMediaAdded(); 
            setNewTitle('');
            setNewBannerImage(null);
            setNewVideoPath(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add media!");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Course Videos</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : media?.length === 0 ? (
                    <Typography>No media available.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Banner Image</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {media?.map((mediaItem) => (
                                    <TableRow key={mediaItem._id}>
                                        <TableCell>{mediaItem.title}</TableCell>
                                        <TableCell>
                                            <img
                                                src={mediaItem.bannerImage}
                                                alt={mediaItem.title}
                                                style={{ width: 100, height: 100 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    label="New Video Title"
                    fullWidth
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ marginTop: '1rem' }}
                />
                <input
                    type="file"
                    accept="image/*"
                    id="banner-image-upload"
                    style={{ marginTop: '1rem' }}
                    onChange={(e) => setNewBannerImage(e.target.files[0])} 
                />
                <label htmlFor="banner-image-upload" style={{ marginTop: '1rem', display: 'block' }}>
                    <Typography variant="body2" color="textSecondary">Upload Banner Image</Typography>
                </label>
                <input
                    type="file"
                    accept="video/*"
                    id="video-upload"
                    style={{ marginTop: '1rem' }}
                    onChange={(e) => setNewVideoPath(e.target.files[0])} 
                />
                <label htmlFor="video-upload" style={{ marginTop: '1rem', display: 'block' }}>
                    <Typography variant="body2" color="textSecondary">Upload Video File</Typography>
                </label>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                <Button
                    onClick={handleAddMedia}
                    color="primary"
                    disabled={!newTitle || !newBannerImage || !newVideoPath}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MediaDialog;
