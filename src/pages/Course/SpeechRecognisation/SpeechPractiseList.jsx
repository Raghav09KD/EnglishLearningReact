import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Button, Row, Col } from "antd";
import { SoundOutlined } from "@ant-design/icons";
import { AudioOutlined } from '@ant-design/icons';
import axios from "axios";
import { fetchAllSpeechPractise } from "./speechHelper";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../lib/path";
import { useGlobalMessage } from "../../../components/MessageProvider/MessageProvider";

const { Title, Paragraph } = Typography;

const SpeechPracticeList = () => {
    const navigate = useNavigate();
    const [speechTexts, setSpeechTexts] = useState([]);
    const [loading, setLoading] = useState(true);

    const message = useGlobalMessage();

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
           <div className="px-6 py-8 w-full">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <Title level={2} className="!mb-0 text-gray-800">
           Speech Practice
        </Title>
        <span className="text-gray-500 text-sm">{speechTexts.length} texts</span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {speechTexts.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item._id}>
              <Card
                hoverable
                className="rounded-2xl shadow-md h-full flex flex-col justify-between"
                bodyStyle={{ padding: "20px" }}
                title={<span className="font-semibold text-gray-800">{item.title}</span>}
              >
                <Paragraph ellipsis={{ rows: 3 }} className="text-gray-600 mb-4">
                  {item.text}
                </Paragraph>

                <div className="flex justify-end">
                  <Button
                    type="primary"
                    icon={<SoundOutlined />}
                    onClick={() => handleStartReading(item)}
                  >
                    Start Reading
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
    );
};

export default SpeechPracticeList;