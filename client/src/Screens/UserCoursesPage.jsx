// UserCoursesPage.js
import React, { useEffect, useState } from 'react';
import {
    Typography,
    LinearProgress,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button
} from '@mui/material';
import api from '../Common/api';
import { useNavigate } from 'react-router-dom';

const UserCoursesPage = ({ Auth }) => {
    const [courseDetails, setcourseDetails] = useState(null);
    const navigate = useNavigate()

    const fetchUserCourses = async () => {
        try {
            const data = await api.getUserCourses(Auth?._id);
            setcourseDetails(data.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if(!Auth && !Auth?._id){
            navigate("/login")
        }
        fetchUserCourses();
        // eslint-disable-next-line
    }, []);

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                {Auth?.fullName}'s Enrolled Courses
            </Typography>
            {!courseDetails || courseDetails?.length === 0 ? (
                <Typography sx={{marginTop:"1rem"}}>No enrolled courses found</Typography>
            ) : (
                <Grid container spacing={4}>
                    {courseDetails?.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course.course._id} sx={{marginTop:"1rem"}}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={course.course.courseImage}
                                    alt={course.course.courseName}
                                />
                                <CardContent>
                                    <Typography variant="h6">
                                        {course.course.courseName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {course.course.description}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={course.course.progress}
                                        style={{ marginTop: '1rem', marginBottom: '1rem' }}
                                    />
                                    <Typography variant="body2">
                                        {course?.course.completedVideos?.length} of {course?.course.totalVideos} Videos Completed
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary"  onClick={() => navigate(`/course-details/${course.course._id}`)}>
                                        View Course
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default UserCoursesPage;
