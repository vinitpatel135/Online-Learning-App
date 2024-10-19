// UserCoursesDialog.js
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    LinearProgress,
} from '@mui/material';
import api from '../Common/api';

const UserCoursesDialog = ({ open, onClose, user }) => {

    const [courseDetails, setcourseDetails] = useState([])

    const fetchUserCourses = async () => {
        try {
            const data = await api.getUserCourses(user?._id)
            setcourseDetails(data.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        setcourseDetails(null);
        onClose(); 
    };

    useEffect(() => {
        fetchUserCourses()
        // eslint-disable-next-line
    }, [user])
    console.log(courseDetails)
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{user?.fullName}'s Enrolled Courses</DialogTitle>
            <DialogContent>
                {!courseDetails && courseDetails?.length === 0 ? (
                    <Typography>No enrolled courses</Typography>
                ) : (
                    courseDetails?.map((course) => (
                        <div key={course.userId} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <img
                                src={course.course.courseImage}
                                alt={course.course.courseName}
                                style={{ marginRight: '1rem', borderRadius: '8px', width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <div style={{ flexGrow: 1 }}>
                                <Typography variant="h6">{course.course.courseName}</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={course.course.progress}
                                    style={{ marginBottom: '0.5rem' }}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    {course.course.completedVideos.length} Videos Completed
                                </Typography>
                            </div>
                        </div>
                    ))
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserCoursesDialog;
