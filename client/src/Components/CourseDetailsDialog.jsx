import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';

const CourseDetailsDialog = ({ open, onClose, course }) => {
    const [selectedVideo, setSelectedVideo] = useState(course?.video[0]);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    useEffect(() => {
        setSelectedVideo(course?.video[0])
        // eslint-disable-next-line
    }, [open])
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Course Details</DialogTitle>
            <DialogContent>
                {course ? (
                    <>
                        <Typography variant="h6">Course Name: {course.courseName}</Typography>
                        <Typography variant="subtitle1">Category: {course.category.name}</Typography>
                        <Typography variant="body1" gutterBottom>Description: {course.description}</Typography>
                        <Typography variant="h6" gutterBottom>Videos:</Typography>
                        <List>
                            {course.video.map((video) => (
                                <ListItem 
                                    key={video._id} 
                                    button={"true"}
                                    onClick={() => handleVideoClick(video)}
                                >
                                    <ListItemText
                                        primary={`Video Title - ${video.title}`}
                                        secondary={<img src={video.bannerImage} alt={video.title} style={{ width: 100, height: 60 }} />}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        {selectedVideo && (
                            <>
                                <Typography variant="h6" gutterBottom>Now Playing: {selectedVideo.title}</Typography>
                                <video 
                                    controls 
                                    style={{ width: '100%', marginTop: '1rem' }} 
                                    src={selectedVideo.videoPath} 
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </>
                        )}
                    </>
                ) : (
                    <Typography variant="body1">No course selected.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CourseDetailsDialog;
