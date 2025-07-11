import React, { useEffect, useState } from "react";
import { Card, List, Typography, Button, Spin, message } from "antd";
import { AudioOutlined } from '@ant-design/icons';
import axios from "axios";
import { fetchAllSpeechPractise } from "./speechHelper";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../lib/path";

const { Title, Paragraph } = Typography;

const SpeechPracticeList = () => {
    const navigate = useNavigate();
    const [speechTexts, setSpeechTexts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTexts = async () => {
        try {
            const res = await fetchAllSpeechPractise();
            console.log("🚀 ~ fetchTexts ~ res:", res)
            setSpeechTexts(res);
        } catch (err) {
            message.error("Failed to fetch practice texts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTexts();
    }, []);

    const handleStartReading = (text) => {
        // Navigate to speech practice page or show modal
         navigate(paths.PRACTISE_SPEECH, {state : {text}})
        console.log("Start reading:", text);
        // message.info(`Get ready to read: "${text.title}"`);
        // Add navigation or modal trigger here
    };

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>📢 Speech Practice</Title>
            {loading ? (
                <Spin size="large" />
            ) : (
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={speechTexts}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                title={<b>{item.title}</b>}
                                extra={
                                    <Button
                                        icon={<AudioOutlined />}
                                        type="primary"
                                        onClick={() => handleStartReading(item)}
                                    >
                                        Start Reading
                                    </Button>
                                }
                            >
                                <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                                    {item.text}
                                </Paragraph>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default SpeechPracticeList;