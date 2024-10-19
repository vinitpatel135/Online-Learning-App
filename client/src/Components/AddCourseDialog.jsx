import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    CircularProgress
} from '@mui/material';
import api from '../Common/api';
import { toast } from 'react-toastify';

const AddCourseDialog = ({ open, onClose }) => {
    const [courseName, setCourseName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');
    const [courseImage, setCourseImage] = useState('');
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await api.getCategories();
            setCategories(res.data.data); 
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch categories");
        }
    };

    const fetchMedia = async () => {
        try {
            const res = await api.listMedia();
            setMediaList(res.data.data); 
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch media");
        }
    };

    useEffect(() => {
        if (open) {
            fetchCategories();
            fetchMedia();
        }
    }, [open]);

    const handleAddCourse = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("courseName", courseName);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("file", courseImage);

            selectedVideos.forEach(videoId => formData.append('video', videoId));

            await api.addCourse(formData);
            toast.success("Course added successfully!");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add course!");
        } finally {
            setLoading(false); // Set loading to false when API call finishes
        }
    };

    const handleVideoSelect = (videoId) => {
        setSelectedVideos(prevSelected => {
            if (prevSelected.includes(videoId)) {
                return prevSelected.filter(id => id !== videoId);
            } else {
                return [...prevSelected, videoId];
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogContent>
                <TextField
                    label="Course Name"
                    fullWidth
                    margin="dense"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    disabled={loading} // Disable input when loading
                />

                <TextField
                    label="Category"
                    select
                    fullWidth
                    margin="dense"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading} // Disable input when loading
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Description"
                    fullWidth
                    margin="dense"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading} // Disable input when loading
                />

                <TextField
                    type="file"
                    fullWidth
                    margin="dense"
                    label="Course Image"
                    onChange={(e) => setCourseImage(e.target.files[0])}
                    disabled={loading} // Disable file input when loading
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Typography variant="h6" style={{ marginTop: '20px' }}>
                    Select Videos for the Course:
                </Typography>
                <List>
                    {mediaList.map((media) => (
                        <ListItem
                            key={media._id}
                            button={"true"}
                            onClick={() => handleVideoSelect(media._id)}
                            disabled={loading} // Disable video selection when loading
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={selectedVideos.includes(media._id)}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={media.title}
                                secondary={<img src={media.bannerImage} alt={media.title} style={{ width: 100, height: 60 }} />}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleAddCourse} 
                    color="primary" 
                    disabled={!courseName || !category || !description || !courseImage || selectedVideos.length === 0 || loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Add Course"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCourseDialog;
