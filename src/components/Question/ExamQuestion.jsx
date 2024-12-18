import { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import PropTypes from "prop-types";
import Question from "./Question";
import { get, qa } from '../../services/api';
import "../css/ExamQuestion.css";

const ExamQuestion = ( { examId, topics, handleChosenQuestionCount }) => {
    const [activeTopicIds, setActiveTopicIds] = useState([]);
    const [questionCountMap, setQuestionCountMap] = useState({});
    
    const sumQuestionCount = (countMap) => {
        return Object.values(countMap).reduce((acc, curr) => acc + curr, 0);
    }

    const fetchQuestionCountMap = async () => {
        const { status, data } = await get(qa, `/exams/${examId}/questionCountMap`);
        if (status === 200) {
            setQuestionCountMap(data);
        }
    }

    useEffect(() => {
        fetchQuestionCountMap();
    }, [examId]);

    useEffect(() => {
        handleChosenQuestionCount(sumQuestionCount(questionCountMap));
    }, [questionCountMap]);

    
    const handleToggle = (topicId) => {
        setActiveTopicIds((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId) // Remove id if it's already active
                : [...prev, topicId] // Add id if it's not active
        );
    };

    const handleQuestionCountChange = (topicId, count) => {
        setQuestionCountMap((prev) => ({ ...prev, [topicId]: count }));
    }

    return (
        <Accordion>
            {topics.map((topic) => (
                <Accordion.Item 
                    eventKey={topic.id.toString()} 
                    key={topic.id}
                    className="mb-2"
                >
                    <Accordion.Header 
                        onClick={() => handleToggle(topic.id)}
                        className={activeTopicIds.includes(topic.id) ? 'active' : ''}
                    >
                        <div className="accordion-header-content">
                            <span className="topic-name">{topic.engName} ({topic.bngName})</span>
                            <span className="question-count">
                                Questions: {questionCountMap[topic.id] || 0}
                            </span>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        { activeTopicIds.includes(topic.id) && 
                            <Question 
                                examId={ examId } 
                                topic={ topic } 
                                handleQuestionCountChange={ handleQuestionCountChange } 
                            /> 
                        }   
                    </Accordion.Body>
                </Accordion.Item>
        ))}
        </Accordion>
    )
}

ExamQuestion.propTypes = {
    topics: PropTypes.array.isRequired,
    examId: PropTypes.number.isRequired,
    handleChosenQuestionCount: PropTypes.func.isRequired,
}

export default ExamQuestion;

