
import { Typography, Table, Tag, Button, Tooltip, Space, Modal, Input, message, Grid } from "antd";
import { EditOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { fetchAllSpeechPractise, toggleSpeechAPI, updateSpeechRecordAPI } from "../Course/SpeechRecognisation/speechHelper";
const { Paragraph, Title } = Typography
const { TextArea } = Input;
const { useBreakpoint } = Grid;

export default function AdminSpeechPractise() {
    // const navigate = useNavigate();
    const [speechPractices, setSpeechPractises] = useState([]);

    // inside your component:
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const screens = useBreakpoint();
    const isMobile = !screens.md;

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
            responsive: ["xs", "sm", "md", "lg", "xl"], // always visible
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
            responsive: ["sm", "md", "lg", "xl"], // hide on xs if needed
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
            ),
            responsive: ["lg"], // only show on lg and above
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
                                    id: record._id,
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
            responsive: ["xs", "sm", "md", "lg", "xl"], // always visible
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
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            {/* Title */}
            <Title
                level={isMobile ? 4 : 3}
                className={`font-semibold ${isMobile ? "text-lg mb-3" : "text-xl mb-4"}`}
            >
                All Speech Practice
            </Title>

            {/* Full Content Modal */}
            <Modal
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                title="Full Content"
                width={isMobile ? "95%" : 600}
                style={isMobile ? { top: 20 } : {}}
                bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
            >
                <p className={isMobile ? "text-sm leading-relaxed" : "text-base"}>
                    {modalContent}
                </p>
            </Modal>

            {/* Edit Modal */}
            <Modal
                open={isEditModalOpen}
                title="Edit Course Content"
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => handleUpdateSpeechRecord(editRecord)}
                width={isMobile ? "95%" : 600}
                style={isMobile ? { top: 20 } : {}}
            >
                <div className="space-y-3">
                    <Input
                        placeholder="Title"
                        value={editRecord.title}
                        onChange={(e) =>
                            setEditRecord((prev) => ({ ...prev, title: e.target.value }))
                        }
                        size={isMobile ? "middle" : "large"}
                    />
                    <TextArea
                        placeholder="Content"
                        rows={isMobile ? 3 : 5}
                        value={editRecord.text}
                        onChange={(e) =>
                            setEditRecord((prev) => ({ ...prev, text: e.target.value }))
                        }
                    />
                </div>
            </Modal>

            {/* Table Wrapper */}
            <div className="w-full">
                <Table
                    columns={columns}
                    dataSource={speechPractices}
                    rowKey="_id"
                    pagination={{
                        pageSize: 6,
                        size: isMobile ? "small" : "default",
                        showSizeChanger: !isMobile,
                        showQuickJumper: !isMobile,
                        simple: isMobile,
                    }}
                    bordered
                    size={isMobile ? "small" : "middle"}
                    scroll={isMobile ? { x: 600 } : undefined}
                />
            </div>
        </div>
    );
}
