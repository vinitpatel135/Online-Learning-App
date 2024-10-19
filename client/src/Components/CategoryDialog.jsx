// CategoryDialog.js
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
    TextField,
    Typography,
    TableContainer,
    Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../Common/api';

const CategoryDialog = ({ open, onClose, onCategoryAdded }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [newAlias, setNewAlias] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await api.getCategories();
            setCategories(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to fetch categories!");
        }
    };

    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);

    const handleAddCategory = async () => {
        try {
            const data = { name: newCategory, alias: newAlias };
            await api.addCategory(data);
            toast.success("Category added successfully!");
            fetchCategories();
            onCategoryAdded();
            setNewCategory('');
            setNewAlias('');
        } catch (err) {
            console.error(err);
            toast.error("Failed to add category!");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Categories</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : categories.length === 0 ? (
                    <Typography>No categories available.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Category Name</TableCell>
                                    <TableCell>Alias</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category._id}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.alias}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    label="New Category Name"
                    fullWidth
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ marginTop: '1rem' }}
                />
                <TextField
                    margin="dense"
                    label="New Alias"
                    fullWidth
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    style={{ marginTop: '1rem' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                <Button onClick={handleAddCategory} color="primary" disabled={!newCategory || !newAlias}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryDialog;
