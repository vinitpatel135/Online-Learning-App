import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    TablePagination, // Import TablePagination
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../Common/api';
import CategoryDialog from '../Components/CategoryDialog';
import UserCoursesDialog from '../Components/UserCoursesDialog';
import MediaDialog from '../Components/MediaDialog';
import AddCourseDialog from '../Components/AddCourseDialog';
import CourseDetailsDialog from '../Components/CourseDetailsDialog';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({Auth}) => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [openUserCoursesDialog, setOpenUserCoursesDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
    const [isAddCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
    const [courseDetailsDialogOpen, setCourseDetailsDialogOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate()

    const fetchUsers = async () => {
        try {
            const res = await api.getUsers();
            setUsers(res.data.data);
            setLoadingUsers(false);
        } catch (err) {
            console.error(err);
            setLoadingUsers(false);
            toast.error("Failed to fetch users!");
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.getCourses();
            setCourses(res.data.data);
            setLoadingCourses(false);
        } catch (err) {
            console.error(err);
            setLoadingCourses(false);
            toast.error("Failed to fetch courses!");
        }
    };

    useEffect(() => {
        if(!Auth && !Auth._id){
            navigate("/login")
            toast.error("Login needed!");
        }
        fetchUsers();
        fetchCourses(); 
        // eslint-disable-next-line
    }, []);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setOpenUserCoursesDialog(true);
    };

    const handleCloseUserCoursesDialog = () => {
        setOpenUserCoursesDialog(false);
        setSelectedUser(null);
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setCourseDetailsDialogOpen(true);
    };

    const handleCloseCourseDetailsDialog = () => {
        setCourseDetailsDialogOpen(false);
        setSelectedCourse(null);
    };

    if (loadingUsers || loadingCourses) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    const handleOpenMediaDialog = () => {
        setMediaDialogOpen(true);
    };

    const handleCloseMediaDialog = () => {
        setMediaDialogOpen(false);
    };

    const handleMediaAdded = () => {
    };

    const handleOpenAddCourseDialog = () => {
        setAddCourseDialogOpen(true);
    };

    const handleCloseAddCourseDialog = () => {
        setAddCourseDialogOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                Admin Dashboard
            </Typography>

            <Button variant="outlined" onClick={() => setOpenCategoryDialog(true)} style={{ marginBottom: '2rem' }}>
                Manage Categories
            </Button>
            <Button variant="outlined" color="primary" onClick={handleOpenMediaDialog} style={{ marginBottom: '2rem', marginLeft: "1rem" }}>
                Add Course Video
            </Button>
            <Button variant="outlined" color="primary" onClick={handleOpenAddCourseDialog} style={{ marginBottom: '2rem', marginLeft: "1rem" }}>
                Add Course
            </Button>

            <CategoryDialog
                open={openCategoryDialog}
                onClose={() => setOpenCategoryDialog(false)}
                onCategoryAdded={fetchUsers}
            />

            <MediaDialog
                open={mediaDialogOpen}
                onClose={handleCloseMediaDialog}
                onMediaAdded={handleMediaAdded}
            />
            <AddCourseDialog open={isAddCourseDialogOpen} onClose={handleCloseAddCourseDialog} />

            {users.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary">
                    No users available.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleUserClick(user)}>
                                            View Courses
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page} 
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Typography variant="h6" gutterBottom align="center" style={{ marginTop: '2rem' }}>
                Courses
            </Typography>

            {courses.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary">
                    No courses available.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Course Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course._id}>
                                    <TableCell>{course.courseName}</TableCell>
                                    <TableCell>{course.category.name}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleCourseClick(course)}>
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <UserCoursesDialog
                open={openUserCoursesDialog}
                onClose={handleCloseUserCoursesDialog}
                user={selectedUser}
            />

            <CourseDetailsDialog
                open={courseDetailsDialogOpen}
                onClose={handleCloseCourseDetailsDialog}
                course={selectedCourse}
            />
        </Container>
    );
};

export default AdminDashboard;
