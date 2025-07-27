import { Typography, Table, Tag, Button, Tooltip, Space, Modal, Input, message } from "antd";
import { EditOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { fetchAllSpeechPractise, toggleSpeechAPI, updateSpeechRecordAPI } from "../Course/SpeechRecognisation/speechHelper";
const { Paragraph } = Typography
const { TextArea } = Input;

export default function AdminSpeechPractise() {
    // const navigate = useNavigate();
    const [speechPractices, setSpeechPractises] = useState([]);

    // inside your component:
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState({ title: "", text: "", id: null });

    const handleShowFullContent = (text) => {
        setModalContent(text);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive) => (
                <Tag color={isActive ? "green" : "volcano"}>
                    {isActive ? "Active" : "Disabled"}
                </Tag>
            ),
            filters: [
                { text: "Active", value: true },
                { text: "Disabled", value: false },
            ],
            onFilter: (value, record) => record.isActive === value,
        },
        {
            title: "Content",
            dataIndex: "text",
            key: "totalCount",
            align: "left",
            render: (text) => (
                <Paragraph
                    ellipsis={{ rows: 1 }}
                    style={{ maxWidth: 200, cursor: "pointer", marginBottom: 0 }}
                    onClick={() => handleShowFullContent(text)}
                >
                    {text}
                </Paragraph>
            )
        },


        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit course details">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() =>
                                setEditRecord({
                                    title: record.title,
                                    text: record.text,
                                    id: record._id
                                }) || setIsEditModalOpen(true)
                            }
                        >
                            Edit
                        </Button>
                    </Tooltip>
                    <Tooltip title={record.isActive ? "Disable course" : "Activate course"}>
                        <Button
                            danger={!record.isActive}
                            type={record.isActive ? "default" : "primary"}
                            icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
                            onClick={() => handleToggleSpeech(record)}
                        >
                            {record.isActive ? "Disable" : "Activate"}
                        </Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleFetchSpeechPrac = async () => {
        try {
            const response = await fetchAllSpeechPractise();
            console.log("🚀 ~ fetchCourses ~ response:", response)

            setSpeechPractises(response);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };


    useEffect(() => {

        handleFetchSpeechPrac();
    }, []);


    const handleToggleSpeech = async (record) => {
        try {
            await toggleSpeechAPI({ speechPractId: record._id });
            const res = await fetchAllSpeechPractise();
            message.success("Speech record updated successfully!");
            setSpeechPractises(res);
        } catch (error) {
            console.error("Error toggling speech:", error);
        }
    }

    const handleUpdateSpeechRecord = async (updatedRecord) => {
        console.log("🚀 ~ handleUpdateSpeechRecord ~ updatedRecord:", updatedRecord)
        try {
            const res = await updateSpeechRecordAPI(updatedRecord);
            console.log("🚀 ~ updateSpeechRecord ~ res:", res);
            const speehes = await fetchAllSpeechPractise();
            setSpeechPractises(speehes);
            message.success("Speech record updated successfully!");
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating speech record:", error);
        }
    }


    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">All Speech Practise</h2>
            <Modal
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                title="Full Content"
            >
                <p>{modalContent}</p>
            </Modal>
            <Modal
                open={isEditModalOpen}
                title="Edit Course Content"
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => handleUpdateSpeechRecord(editRecord)}
            >
                <Input
                    placeholder="Title"
                    className="mb-3"
                    value={editRecord.title}
                    onChange={(e) =>
                        setEditRecord((prev) => ({ ...prev, title: e.target.value }))
                    }
                />
                <TextArea
                    placeholder="Content"
                    rows={4}
                    value={editRecord.text}
                    onChange={(e) =>
                        setEditRecord((prev) => ({ ...prev, text: e.target.value }))
                    }
                />
            </Modal>
            <Table
                columns={columns}
                dataSource={speechPractices}
                rowKey="_id"
                pagination={{ pageSize: 6 }}
                bordered
            />
        </div>
    );
}
