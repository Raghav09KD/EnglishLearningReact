import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../../../components/ui/Input';
import TextArea from 'antd/es/input/TextArea';
import { Button, Select } from 'antd';
import toast from 'react-hot-toast';
import { createSpeech } from './speechHelper';


const CreateSpeechPractice = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);

  // Fetch course list if needed
  useEffect(() => {
    // const fetchCourses = async () => {
    //   try {
    //     const res = await axios.get("/api/courses/getCources", {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //       },
    //     });
    //     setCourses(res.data);
    //   } catch (err) {
    //     console.error("Error fetching courses:", err);
    //   }
    // };

    // fetchCourses();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
      toast.error("Title and text are required.");
      return;
    }

    try {
      const payload = {
        title,
        text,
        ...(courseId && { courseId }),
      };
    
      const res = await createSpeech(payload);

      toast.success("Speech practice created!");
      setTitle("");
      setText("");
      setCourseId("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create speech practice.");
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">🗣️ Create Speech Practice</h2>

      <Input
        type="text"
        placeholder="Practice Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />

      <TextArea
        placeholder="Enter paragraph or sentence for pronunciation practice..."
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4"
      />

      {/* <Select
        onValueChange={setCourseId}
        value={courseId}
        className="mb-4"
      >
        <SelectItem value="">Optional - Link to Course</SelectItem>
        {courses.map((c) => (
          <SelectItem key={c._id} value={c._id}>
            {c.title}
          </SelectItem>
        ))}
      </Select> */}

      <Button onClick={handleSubmit} className="w-full">
        Create Practice
      </Button>
    </div>
  );
};

export default CreateSpeechPractice;