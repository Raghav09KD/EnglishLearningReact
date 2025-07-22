import { Drawer, Descriptions, Collapse, Table, Tag, Divider, Empty } from 'antd';

const { Panel } = Collapse;

export default function UserProgressDrawer({ open, onClose, userData }) {
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

  const speechColumns = [
    { title: 'Text', dataIndex: 'expectedText', key: 'expectedText' },
    { title: 'Score', dataIndex: 'score', key: 'score' },
    {
      title: 'Attempted At',
      dataIndex: 'attemptedAt',
      key: 'attemptedAt',
      render: (val) => new Date(val).toLocaleString(),
    },
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

      {courseProgress.length === 0 ? (
        <Empty description="No progress found" />
      ) : (
        <Collapse accordion>
          {courseProgress.map((course, index) => (
            <Panel header={course.course.title} key={index}>
              <p>
                <strong>Current Section:</strong> {course.currentSection}
              </p>
              <p>
                <strong>Completed Sections:</strong>{' '}
                {course.completedSections?.length || 0}
              </p>

              <Divider orientation="left">Quiz Scores</Divider>
              {course.quizScores.length > 0 ? (
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

              <Divider orientation="left">Speech Scores</Divider>
              {course.speechScores.length > 0 ? (
                <Table
                  columns={speechColumns}
                  dataSource={course.speechScores}
                  rowKey={(record, i) => `speech-${i}`}
                  pagination={false}
                  size="small"
                />
              ) : (
                <Tag color="orange">No speech attempts</Tag>
              )}
            </Panel>
          ))}
        </Collapse>
      )}
    </Drawer>
  );
}
