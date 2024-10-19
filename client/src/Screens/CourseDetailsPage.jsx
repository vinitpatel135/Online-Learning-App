// CourseDetailsPage.js
import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../Common/api';

const CourseDetailsPage = ({ Auth }) => {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const fetchCourseDetails = async () => {
        try {
            const data = await api.getCourseDetails({ courseId, userId: Auth._id });
            setCourseDetails(data.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const markVideoAsCompleted = async (videoId) => {
        try {
            let data = await api.markVideoAsCompleted({ courseId, videoId, userId: Auth?._id });
            data = data.data.data
            setCourseDetails({ ...courseDetails, completedVideo: data.completedVideo })
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
        // eslint-disable-next-line
    }, []);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                {courseDetails?.courseId?.courseName}
            </Typography>
            <Card style={{ marginBottom: '2rem' }}>
                <CardMedia
                    component="img"
                    height="300"
                    sx={{ objectFit: "contain" }}
                    image={courseDetails?.courseId.courseImage}
                    alt={courseDetails?.courseId.courseName}
                />
                <CardContent>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        {courseDetails?.courseId.description}
                    </Typography>
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom>
                Course Videos
            </Typography>
            <Grid container spacing={3}>
                {courseDetails?.courseId?.video?.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video._id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={video.bannerImage}
                                alt={video.title}
                                onClick={() => handleVideoClick(video)}
                                style={{ cursor: 'pointer' }}
                            />
                            <CardContent>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Click to Play Video
                                </Typography>
                                <Typography variant="h6">{video.title}</Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => markVideoAsCompleted(video._id)}
                                    disabled={courseDetails?.completedVideo?.includes(video._id)}
                                >
                                    {courseDetails?.completedVideo?.includes(video._id) ? 'Completed' : 'Mark as Completed'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {selectedVideo && (
                <div style={{ marginTop: '2rem' }}>
                    <Typography variant="h5" gutterBottom>
                        Now Playing: {selectedVideo.title}
                    </Typography>
                    <video
                        controls
                        width="100%"
                        height="auto"
                        src={selectedVideo.videoPath}
                        style={{ borderRadius: '8px' }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </Container>
    );
};

export default CourseDetailsPage;
