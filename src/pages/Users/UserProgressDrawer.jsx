import { Drawer, Descriptions, Collapse, Table, Tag, Divider, Empty } from 'antd';

const { Panel } = Collapse;

export default function UserProgressDrawer({ open, onClose, userData, listeningProgress, speechProgress }) {
  if (!userData) return null;

  const { user, courseProgress = [] } = userData;

  const quizColumns = [
    { title: 'Section', dataIndex: 'sectionIndex', key: 'sectionIndex' },
    { title: 'Score', dataIndex: 'score', key: 'score' },
    { title: 'Correct', dataIndex: 'correctAnswers', key: 'correctAnswers' },
    { title: 'Total', dataIndex: 'totalQuestions', key: 'totalQuestions' },
    {
      title: 'Attempted At',
      dataIndex: 'attemptedAt',
      key: 'attemptedAt',
      render: (val) => new Date(val).toLocaleString(),
    },
  ];

  // Table columns
  const listeningColumns = [
    { title: "Course", dataIndex: "courseTitle", key: "courseTitle" },
    { title: "Score", dataIndex: "score", key: "score" },
    { title: "Total Qs", dataIndex: "totalQuestions", key: "totalQuestions" },
    { title: "Completed At", dataIndex: "completedAt", key: "completedAt" },
  ];

  const speechColumns = [
    { title: "Expected", dataIndex: "expectedText", key: "expectedText" },
    { title: "Spoken", dataIndex: "spokenText", key: "spokenText" },
    { title: "Score", dataIndex: "score", key: "score" },
    { title: "Date", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <Drawer
      title={`Progress: ${user?.name}`}
      placement="right"
      onClose={onClose}
      open={open}
      width={700}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* --- Course Progress --- */}
      <Divider orientation="left">Course Progress</Divider>
      {courseProgress.length === 0 ? (
        <Empty description="No course progress" />
      ) : (
        <Collapse accordion>
          {courseProgress.map((course, index) => (
            <Panel header={course?.course?.title} key={index}>
              <p>
                <strong>Current Section:</strong> {course?.currentSection}
              </p>
              <p>
                <strong>Completed Sections:</strong>{" "}
                {course?.completedSections?.length || 0}
              </p>

              <Divider orientation="left">Quiz Scores</Divider>
              {course?.quizScores?.length > 0 ? (
                <Table
                  columns={quizColumns}
                  dataSource={course.quizScores}
                  rowKey={(record, i) => `quiz-${i}`}
                  pagination={false}
                  size="small"
                />
              ) : (
                <Tag color="orange">No quiz attempts</Tag>
              )}

             
            </Panel>
          ))}
        </Collapse>
      )}

      {/* --- Listening Practice --- */}
      <Divider orientation="left">Listening Practice</Divider>
      {listeningProgress.length > 0 ? (
        <Table
          columns={listeningColumns}
          dataSource={listeningProgress}
          rowKey={(record) => record._id}
          pagination={false}
          size="small"
        />
      ) : (
        <Tag color="orange">No listening attempts</Tag>
      )}

      {/* --- Speech Practice --- */}
      <Divider orientation="left">Speech Practice</Divider>
      {speechProgress.length > 0 ? (
        <Table
          columns={speechColumns}
          dataSource={speechProgress}
          rowKey={(record) => record._id}
          pagination={false}
          size="small"
        />
      ) : (
        <Tag color="orange">No speech attempts</Tag>
      )}
    </Drawer>
  );
}
