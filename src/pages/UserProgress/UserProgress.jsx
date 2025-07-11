import { useEffect, useState } from 'react';
import { Table, Collapse, Card, Tag, Descriptions, Progress } from 'antd';
import { getStudentProgress } from '../Course/coursesHelper';
const { Panel } = Collapse;

export default function AdminProgress() {
  const [data, setData] = useState([]);

const groupByUser = (data) => {
  const map = new Map();

  data.forEach((entry) => {
    const userId = entry.user._id;
    if (!map.has(userId)) {
      map.set(userId, {
        user: entry.user,
        courses: [],
        totalQuizScore: 0,
        totalQuizCount: 0,
        totalSpeechScore: 0,
        totalSpeechCount: 0,
      });
    }

    const userEntry = map.get(userId);

    // Accumulate quiz scores
    if (entry.quizScores?.length) {
      entry.quizScores.forEach((q) => {
        userEntry.totalQuizScore += q.score;
        userEntry.totalQuizCount++;
      });
    }

    // Accumulate speech scores
    if (entry.speechScores?.length) {
      entry.speechScores.forEach((s) => {
        userEntry.totalSpeechScore += s.score;
        userEntry.totalSpeechCount++;
      });
    }

    userEntry.courses.push({
      course: entry.course,
      quizScores: entry.quizScores,
      speechScores: entry.speechScores,
      completedSections: entry.completedSections,
      currentSection: entry.currentSection,
    });
  });

  // Finalize and compute overall score
  return Array.from(map.values()).map((user) => {
    const totalScoreSum = user.totalQuizScore + user.totalSpeechScore;
    const totalCount = user.totalQuizCount + user.totalSpeechCount;
    const overallScore = totalCount > 0 ? Math.round(totalScoreSum / totalCount) : 0;

    return {
      ...user,
      overallScore,
    };
  });
};

  useEffect(() => {
    async function fetchProgress() {
      const res = await getStudentProgress();

     const grp = groupByUser(res);
     if(grp?.length > 0) {
      setData(grp);
     }
      console.log("🚀 ~ fetchProgress ~ res:", res)
    };
    fetchProgress();
  }, []);

   const columns = [
    {
      title: 'Student Name',
      dataIndex: ['user', 'name'],
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
    },
    {
      title: 'Courses Enrolled',
      render: (_, record) => <Tag color="blue">{record.courses.length}</Tag>,
    },
     {
    title: 'Overall Score',
    dataIndex: 'overallScore',
    render: (score) => (
      <span className={score >= 75 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'}>
        {score}%
      </span>
    ),
  },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.user._id}
      expandable={{
        expandedRowRender: (record) => (
          <Collapse accordion>
            {record.courses.map((courseObj, i) => (
              <Panel header={courseObj.course.title} key={i}>
                <Card title="Quiz Scores" size="small">
                  {courseObj.quizScores.map((quiz, idx) => (
                    <Card
                      key={idx}
                      type="inner"
                      title={`Section ${quiz.sectionIndex + 1} | Score: ${quiz.score}%`}
                      style={{ marginBottom: 12 }}
                    >
                      <Progress percent={quiz.score} size="small" />

                      {quiz.details.map((q, qIdx) => (
                        <Descriptions
                          key={qIdx}
                          title={`Q${qIdx + 1}: ${q.question}`}
                          bordered
                          size="small"
                          column={1}
                        >
                          <Descriptions.Item label="Options">
                            {q.options.map((opt, i) => (
                              <Tag
                                key={i}
                                color={
                                  i === q.correct
                                    ? 'green'
                                    : i === q.selected
                                    ? 'red'
                                    : 'default'
                                }
                              >
                                {opt}
                              </Tag>
                            ))}
                          </Descriptions.Item>
                          <Descriptions.Item label="Selected">
                            {q.options[q.selected - 1] || 'Not answered'}
                          </Descriptions.Item>
                          <Descriptions.Item label="Correct Answer">
                            {q.options[q.correct - 1]}
                          </Descriptions.Item>
                        </Descriptions>
                      ))}
                    </Card>
                  ))}
                </Card>

                {courseObj.speechScores?.length > 0 && (
                  <Card title="Speech Scores" size="small" style={{ marginTop: 20 }}>
                    {courseObj.speechScores.map((speech, i) => (
                      <Card
                        key={i}
                        type="inner"
                        title={`Speech Score: ${speech.score}%`}
                        style={{ marginBottom: 12 }}
                      >
                        <p><strong>Total Words:</strong> {speech.totalExpected}</p>
                        <p><strong>Correct:</strong> {speech.correct}</p>
                        <p>
                          <strong>Mistakes:</strong>{' '}
                          {speech.mistakes?.map((m, i) => (
                            <Tag key={i} color="red">{m}</Tag>
                          ))}
                        </p>
                      </Card>
                    ))}
                  </Card>
                )}
              </Panel>
            ))}
          </Collapse>
        ),
      }}
    />
  );
};
