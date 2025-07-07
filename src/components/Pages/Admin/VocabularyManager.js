import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../../../context/authAdmin';
import './VocabularyManager.css';

const VocabularyManager = () => {
  const [vocabList, setVocabList] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const { adminUser } = useContext(AdminAuthContext);


  useEffect(() => {
    if (adminUser) {
      fetchVocab();
    }
  }, [adminUser]);

  const fetchVocab = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vocabulary');
      setVocabList(res.data);
    } catch (err) {
      console.error('Error fetching vocabulary:', err);
    }
  };

  const addVocabulary = async () => {
    if (!newWord.trim() || !newMeaning.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/vocabulary', {
        word: newWord,
        meaning: newMeaning
      });
      setNewWord('');
      setNewMeaning('');
      fetchVocab();
    } catch (err) {
      console.error('Error adding vocabulary:', err);
    }
  };

  const deleteVocab = async (id) => {
    if (!window.confirm('Are you sure you want to delete this word?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/vocabulary/${id}`);
      fetchVocab();
    } catch (err) {
      console.error('Error deleting word:', err);
    }
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
          Please login to manage Vocabulary content.
        </h2>
      </div>
    );
  }

  return (
    <div className="vocab-container">
      <h2>📚 Manage Vocabulary</h2>

      <div className="vocab-form">
        <input
          type="text"
          placeholder="Word"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
        />
        <input
          type="text"
          placeholder="Meaning"
          value={newMeaning}
          onChange={(e) => setNewMeaning(e.target.value)}
        />
        <button onClick={addVocabulary}>➕ Add</button>
      </div>

      <div className="vocab-list">
        {vocabList.length === 0 ? (
          <p className="no-vocab">No vocabulary added yet.</p>
        ) : (
          vocabList.map((item) => (
            <div key={item._id} className="vocab-card">
              <h4>{item.word}</h4>
              <p>{item.meaning}</p>
              <button className="delete-btn" onClick={() => deleteVocab(item._id)}>
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VocabularyManager;
