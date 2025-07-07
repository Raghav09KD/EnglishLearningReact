import React, { useEffect, useState, useContext  } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../../../context/authAdmin';
import './GrammarManager.css';

const GrammarManager = () => {
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingLesson, setEditingLesson] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { adminUser } = useContext(AdminAuthContext);

  useEffect(() => {
    if (adminUser) {
      fetchLessons();
    }
  }, [adminUser]);


  const fetchLessons = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/grammar');
      setLessons(res.data);
    } catch (err) {
      console.error('Error fetching lessons:', err);
    }
  };

  const handleSaveLesson = async () => {
    try {
      if (editingLesson) {
        await axios.put(`http://localhost:5000/api/admin/grammar/${editingLesson._id}`, { title, content });
      } else {
        await axios.post('http://localhost:5000/api/admin/grammar', { title, content });
      }
      fetchLessons();
      resetForm();
    } catch (err) {
      console.error('Error saving lesson:', err);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/grammar/${id}`);
      fetchLessons();
    } catch (err) {
      console.error('Error deleting lesson:', err);
    }
  };

  const startEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setContent(lesson.content);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingLesson(null);
    setTitle('');
    setContent('');
    setShowForm(false);
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
        Please login to manage grammar content.
      </h2>
    </div>
  );
}

  return (
    <div className="grammar-manager">
      <h2>📘 Manage Grammar Lessons</h2>

      <button className="open-modal-btn" onClick={() => setShowForm(true)}>➕ Add New Lesson</button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
            <input
              type="text"
              placeholder="Lesson Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Lesson Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleSaveLesson}>{editingLesson ? 'Update' : 'Add'}</button>
              <button className="cancel" onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="lesson-list">
        {lessons.length === 0 ? (
          <p className="no-lessons">No lessons found.</p>
        ) : (
          lessons.map((lesson) => (
            <div key={lesson._id} className="lesson-card">
              <h3>{lesson.title}</h3>
              <p>{lesson.content}</p>
              <div className="lesson-actions">
                <button onClick={() => startEditLesson(lesson)}>✏️ Edit</button>
                <button className="delete" onClick={() => handleDeleteLesson(lesson._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GrammarManager;
