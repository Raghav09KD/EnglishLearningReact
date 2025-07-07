import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../../../context/authAdmin';
import './PronunciationManager.css';

const PronunciationManager = () => {
    const [entries, setEntries] = useState([]);
    const [word, setWord] = useState('');
    const [editingEntry, setEditingEntry] = useState(null);
    const { adminUser } = useContext(AdminAuthContext);

    useEffect(() => {
        if (adminUser) {
            fetchPronunciations();
        }
    }, [adminUser]);

    const fetchPronunciations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/pronunciation');
            setEntries(res.data);
        } catch (err) {
            console.error('Error fetching pronunciation entries:', err);
        }
    };

    const handleSave = async () => {
        if (!word.trim()) return;

        try {
            if (editingEntry) {
                await axios.put(`http://localhost:5000/api/pronunciation/${editingEntry._id}`, { word });
            } else {
                await axios.post('http://localhost:5000/api/pronunciation', { word });
            }
            resetForm();
            fetchPronunciations();
        } catch (err) {
            console.error('Error saving entry:', err);
        }
    };

    const handleEdit = (entry) => {
        setWord(entry.word);
        setEditingEntry(entry);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/pronunciation/${id}`);
            fetchPronunciations();
        } catch (err) {
            console.error('Error deleting entry:', err);
        }
    };

    const resetForm = () => {
        setEditingEntry(null);
        setWord('');
    };

    if (!adminUser) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
            }}>
                <h2 style={{
                    color: 'black',
                    fontWeight: 500,
                    fontSize: '24px',
                    textAlign: 'center',
                }}>
                    Please login to manage Pronunciation content.
                </h2>
            </div>
        );
    }

    return (
        <div className="pronunciation-container">
            <h2>📚 Manage Pronunciation Exercises</h2>

            <div className="pronunciation-form">
                <input
                    type="text"
                    placeholder="Word"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                />
                <button className="action-button" onClick={handleSave}>
                    {editingEntry ? "🔄 Update" : "➕ Add"}
                </button>
            </div>

            <div className="pronunciation-cards">
                {entries.length === 0 ? (
                    <p>No entries found.</p>
                ) : (
                    entries.map((entry) => (
                        <div key={entry._id} className="pronunciation-card">
                            <h4>{entry.word}</h4>
                            <div className="card-buttons">
                                <button className="edit-btn" onClick={() => handleEdit(entry)}>✏️ Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(entry._id)}>🗑 Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PronunciationManager;
