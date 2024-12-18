import { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { get, post, put, deleteEntry, qa } from '../../services/api';
import QuestionModal from './QuestionModal';
import QuestionList from './QuestionList';
import DeleteConfirmation from '../util/DeleteConfirmation';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';

const Question = ({ examId, topic, handleQuestionCountChange }) => {
    // State
    const [ data, setData ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showModal, setShowModal ] = useState(false);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(true);
    const [ id, setId ] = useState(null);
    const [ subTopicOptions, setSubTopicOptions ] = useState([]);

  // Mock data
    const content = [
        { id: 1, engName: 'John Doe', bngName: 'জন ডো', grade: 9 },
        { id: 2, engName: 'Jane Smith', bngName: 'জেন স্মিথ', grade: 10 },
        { id: 3, engName: 'Michael Lee', bngName: 'মাইকেল লি', grade: 9 },
    ];

    const fetchExamQuestions = async (showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }

        const url = `/exams/${examId}/questions/${topic.id}`;

        const response = await get(qa, url);
        if (response.status === 200) {
            if (response.data.length != data.length) {
                handleQuestionCountChange(topic.id, response.data.length);
            }
            setData(response.data);
        }
        if (showLoading) {
            setIsLoading(false);
        }
    }

    const loadSubTopics = async () => {
        const { status, data } = await get(qa, `/topics/${topic.id}/directSubTopics`);
        if (status === 200) {
            setSubTopicOptions(data.map(subTopic => ({ value: subTopic.id, label: subTopic.engName + "( " + subTopic.bngName + " )" })));
        }
    }

    useEffect(() => {
        fetchExamQuestions();
        loadSubTopics();
    }, [examId, topic]);


    const columns = [
        // { text: '#', dataField: 'id' },
        { text: 'Topic', dataField: 'topic' },
        { text: 'Question', dataField: 'questionEn' },
        { text: 'Options', dataField: 'optionResponses' },
        { text: 'Answer', dataField: 'mcqAns' },
    ];

  
    // Handlers

    const findPostById = (id) => {
        return data.find(p => p.id === id);
    }

    const handleEdit = (id) => {
        console.log('clicked exam question id', id);
        setId(id);
        setIsCreating(false);
        setShowModal(true);
    }

    const handleDelete = (id) => {
        setId(id);
        setShowDeleteConfirmation(true);
    };

    const handleOk = () => {
        fetchExamQuestions(false);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    const handleError = (error) => {
        setTimeout(() => {
            setIsLoading(false);
            console.error(error);
        }, 500);
    }

    const deletePost = async (id) => {
        setIsLoading(true);
        const { status, data } = await deleteEntry(qa, `/exams/${examId}/questions`, id);
        if (status === 204) {
            handleOk();
        } else {
            handleError(data);
        }
    };

    const handleDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        deletePost(id);
    }
      
    const handleAddNew = () => {
        setId(null);
        setIsCreating(true);
        setShowModal(true);
        console.log(showModal);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    const saveQuestion = (question) => {
        return isCreating 
            ? post(qa, `/questions`, question) 
            : put(qa, `/questions`, question);
    }

    const getExamQuestion = (savedQuestion) => {
        return {
            id,
            questionId: savedQuestion.id,
            examId,
            marks: 1,
            ans: savedQuestion.mcqAns,
        }
    }

    const handleSave = async (question) => {
        setIsLoading(true);

        const { status, data } = await saveQuestion(question);

        if (status >= 200 && status < 300) {
            const examQuestion = getExamQuestion(data);
            const url = `/exams/${examId}/questions`;
            const response = await (isCreating ? post(qa, url, [ examQuestion ]) : put(qa, url, examQuestion));
            if (response.status >= 200 && response.status < 300) {
                handleClose();
                handleOk();
            } else {
                handleError(response.data);
            }
        } else {
            handleError(data);
        }
    }

    return (
        <div className="mt-4">
            <QuestionModal 
                isCreating={isCreating}
                show={ showModal } 
                topic={topic}
                content={ isCreating ? null : findPostById(id) }
                subTopicOptions={subTopicOptions}
                handleClose={handleClose} 
                handleSave={handleSave} 
            />
            <DeleteConfirmation
                show={showDeleteConfirmation}
                onConfirm={ handleDeleteConfirmation }
                onCancel={() => setShowDeleteConfirmation(false)}
                message="Are you sure you want to remove this question from exam?"
            />

            <div>
                <Row>
                    <Col md={12} className="d-flex justify-content-end mb-3">
                        <Button variant="success" onClick={handleAddNew}>
                            <FaPlus className="me-1" /> New Question
                        </Button>
                    </Col>
                </Row>
            </div>
            {isLoading 
                ? <div className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div> 
                : <QuestionList 
                    data={data} 
                    handleEdit={handleEdit} 
                    handleDelete={handleDelete} 
                />
            }
        </div>
    );
};

Question.propTypes = {
    examId: PropTypes.number.isRequired,
    topic: PropTypes.object.isRequired,
    handleQuestionCountChange: PropTypes.func.isRequired,
}

export default Question;
