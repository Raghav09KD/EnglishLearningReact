import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../../../context/authAdmin';
import './StoryManager.css';

const StoryManager = () => {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingStory, setEditingStory] = useState(null);
  const { adminUser } = useContext(AdminAuthContext);


  useEffect(() => {
    if (adminUser) {
      fetchStories();
    }
  }, [adminUser]);

  const fetchStories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stories');
      setStories(res.data);
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      if (editingStory) {
        await axios.put(`http://localhost:5000/api/stories/${editingStory._id}`, { title, content });
      } else {
        await axios.post('http://localhost:5000/api/stories', { title, content });
      }
      resetForm();
      fetchStories();
    } catch (err) {
      console.error('Error saving story:', err);
    }
  };

  const handleEdit = (story) => {
    setTitle(story.title);
    setContent(story.content);
    setEditingStory(story);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/stories/${id}`);
      fetchStories();
    } catch (err) {
      console.error('Error deleting story:', err);
    }
  };

  const resetForm = () => {
    setEditingStory(null);
    setTitle('');
    setContent('');
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
          Please login to manage Story content.
        </h2>
      </div>
    );
  }

  return (
    <div className="story-container">
      <h2>📖 Manage Story Content</h2>

      <div className="story-form">
        <input
          type="text"
          placeholder="Story Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Story Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editingStory ? "🔄 Update Story" : "➕ Add Story"}
        </button>
      </div>

      <div className="story-list">
        {stories.length === 0 ? (
          <p>No stories found.</p>
        ) : (
          stories.map((story) => (
            <div key={story._id} className="story-card">
              <h4>{story.title}</h4>
              <p>{story.content.length > 100 ? story.content.slice(0, 100) + '...' : story.content}</p>
              <div className="story-actions">
                <button className="edit-btn" onClick={() => handleEdit(story)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(story._id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StoryManager;
