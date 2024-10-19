import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Container, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, CardMedia } from '@mui/material';
import api from '../Common/api';
import { toast } from 'react-toastify';

const Home = ({ Auth }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const fetchCourses = async () => {
        try {
            const res = await api.getCourses();
            setCourses(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to fetch courses!");
        }
    };

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line
    }, []);

    const handleCardClick = (course) => {
        setSelectedCourse(course);
        setOpenDialog(true);
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    const handleEnroll = async (course) => {
        console.log(course)
        if (!Auth && !Auth._id) {
            toast.error("Please Login for Enroll!");
        } else {
            const data = {
                courseId: course._id,
                userId: Auth._id
            };
            try {
                const res = await api.enrollUserInCourse(data);
                if (res.data.message === "Success") {
                    toast.success(`Successfully enrolled in ${course.title}!, You can see your emrolled courses in Your Courses`);
                    setOpenDialog(false);
                    fetchCourses();
                } else {
                    toast.error("Failed to enroll in the course!");
                }
            } catch (error) {
                toast.error("Error occurred while enrolling!");
            }
        }
    };
    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                Available Courses
            </Typography>

            {courses.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary">
                    No courses available.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course._id}>
                            <Card
                                style={{
                                    height: '340px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                }}
                                onClick={() => handleCardClick(course)}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={course.courseImage}
                                    alt={course.title}
                                />
                                <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" component="h2" gutterBottom style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                                        {course.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ flexGrow: 1 }}>
                                        {course.description.length > 100
                                            ? `${course.description.substring(0, 100)}...`
                                            : course.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{selectedCourse?.title}</DialogTitle>
                <DialogContent>
                    {selectedCourse?.courseImage && (
                        <CardMedia
                            component="img"
                            height="500"
                            image={selectedCourse.courseImage}
                            alt={selectedCourse.courseName}
                            style={{ width: '100%', objectFit: "contain" }}
                        />
                    )}
                    <Typography variant="h4" gutterBottom>
                        {selectedCourse?.courseName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Category :- {selectedCourse?.category.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Total Videos :- {selectedCourse?.video.length}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Description :- {selectedCourse?.description}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEnroll(selectedCourse)}
                    >
                        Enroll Now
                    </Button>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Home;
