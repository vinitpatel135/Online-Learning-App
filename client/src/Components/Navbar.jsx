import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Hidden, // Import Hidden
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ Auth, setAuth }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('token');
        navigate("/signup");
    };

    const isActive = (path) => location.pathname === path;

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const drawerLinks = (
        <List>
            {Auth && Auth.role === "admin" && (
                <ListItem button="true" component={Link} to="/dashboard">
                    <ListItemText primary="Dashboard" sx={{ color: "white" }} />
                </ListItem>
            )}
            <ListItem button="true" component={Link} to="/">
                <ListItemText primary="Home" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button="true" component={Link} to="/your-courses">
                <ListItemText primary="Your Courses" sx={{ color: "white" }} />
            </ListItem>
            {Auth && Auth._id ? (
                <ListItem button="true" onClick={logout}>
                    <ListItemText primary="Sign Out" sx={{ color: "white" }} />
                </ListItem>
            ) : (
                <>
                    <ListItem button="true" component={Link} to="/signin">
                        <ListItemText primary="Sign In" sx={{ color: "white" }} />
                    </ListItem>
                    <ListItem button="true" component={Link} to="/signup">
                        <ListItemText primary="Sign Up" sx={{ color: "white" }} />
                    </ListItem>
                </>
            )}
        </List>
    );

    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Online Learning Platform
                    </Typography>

                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={toggleDrawer(true)}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Hidden mdDown>
                        {Auth && Auth.role === "admin" && (
                            <Button
                                color="inherit"
                                component={Link}
                                to="/dashboard"
                                sx={{
                                    borderBottom: isActive('/dashboard') ? '2px solid #fff' : 'none',
                                }}
                            >
                                Dashboard
                            </Button>
                        )}
                        <Button
                            color="inherit"
                            component={Link}
                            to="/"
                            sx={{
                                borderBottom: isActive('/') ? '2px solid #fff' : 'none',
                            }}
                        >
                            Home
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/your-courses"
                            sx={{
                                borderBottom: isActive('/your-courses') ? '2px solid #fff' : 'none',
                            }}
                        >
                            Your Courses
                        </Button>
                        {Auth && Auth._id ? (
                            <Button
                                color="inherit"
                                onClick={logout}
                                sx={{
                                    borderBottom: isActive('/logout') ? '2px solid #fff' : 'none',
                                }}
                            >
                                Sign Out
                            </Button>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/signin"
                                    sx={{
                                        borderBottom: isActive('/signin') ? '2px solid #fff' : 'none',
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/signup"
                                    sx={{
                                        borderBottom: isActive('/signup') ? '2px solid #fff' : 'none',
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Hidden>
                </Toolbar>
            </Container>

            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <div
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    {drawerLinks}
                </div>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
