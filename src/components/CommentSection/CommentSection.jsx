
import React, { useEffect, useState } from 'react';
import { List, Avatar, Typography, Input, Button } from 'antd';
import { addCommentAPI, fetchAllComments } from './commentHelper';
import { useGlobalMessage } from '../MessageProvider/MessageProvider';

const { Text, Title } = Typography;
const { TextArea } = Input;

const CommentSection = ({ canComment = true, courseId }) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const message = useGlobalMessage();
    const handleAddComment = async () => {
        if (!commentText.trim()) return message.warning('Please enter a comment');
        try {
            setLoading(true);

            await addCommentAPI({
                comment: commentText.trim(),
                courseId: courseId
            })
            fetchAllComments(courseId)
                .then(response => {
                    setComments(response || []);
                })
                .catch(err => {
                    console.error(err);
                    message.error('Failed to fetch comments');
                });
            setCommentText('');
            message.success('Comment added successfully');
        } catch (err) {
            console.error(err);
            message.error('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchAllComments(courseId)
            .then(response => {
                setComments(response || []);
            })
            .catch(err => {
                console.error(err);
                message.error('Failed to fetch comments');
            });
    }, []);

    return (
        <div style={{ marginTop: 24 }}>
            <Title level={4}>💬 Student Comments</Title>
            <List
                itemLayout="horizontal"
                dataSource={comments}
                locale={{ emptyText: "No comments yet. Be the first to leave one!" }}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar>{item?.userId?.name?.[0]?.toUpperCase() || 'U'}</Avatar>}
                            title={<Text strong>{item?.userId?.name || 'Unknown Student'}</Text>}
                            description={
                                <>
                                    <Text>{item.comment}</Text>
                                    <div style={{ fontSize: '12px', color: '#999' }}>
                                        {new Date(item.createdAt).toLocaleString()}
                                    </div>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />

            {canComment && (
                <div style={{ marginTop: 24 }}>
                    <Title level={5}>Add Your Comment</Title>
                    <TextArea
                        rows={3}
                        placeholder="Write your thoughts about the course..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="primary" onClick={handleAddComment} loading={loading}>
                        Submit Comment
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
