import { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { get, post, put, deleteEntry, qa } from '../../services/api';
import QuestionModal from './QuestionModal';
import QuestionList from './QuestionList';
import DeleteConfirmation from '../util/DeleteConfirmation';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';

const Question = ({ examId, topic }) => {
    // State
    const [ data, setData ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showModal, setShowModal ] = useState(false);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(true);
    const [ id, setId ] = useState(null);

  // Mock data
    const content = [
        { id: 1, engName: 'John Doe', bngName: 'জন ডো', grade: 9 },
        { id: 2, engName: 'Jane Smith', bngName: 'জেন স্মিথ', grade: 10 },
        { id: 3, engName: 'Michael Lee', bngName: 'মাইকেল লি', grade: 9 },
    ];

    const fetchQuestions = async (showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }

        const url = `/exams/${examId}/questions/${topic.id}`;

        const { status, data } = await get(qa, url);
        if (status === 200) {
            setData(data);
        }
        if (showLoading) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, []);


    const columns = [
        // { text: '#', dataField: 'id' },
        { text: 'Topic', dataField: 'topic' },
        { text: 'Question', dataField: 'questionEn' },
        { text: 'Options', dataField: 'optionResponses' },
        { text: 'Answer', dataField: 'mcqAns' },
    ];

  
    // Handlers

    const findPostById = (id) => {
        return data.content.find(p => p.id === id);
    }

    const handleEdit = (id) => {
        console.log('clicked post id', id);
        setId(id);
        setIsCreating(false);
        setShowModal(true);
    }

    const handleDelete = (id) => {
        setId(id);
        setShowDeleteConfirmation(true);
    };

    const handleOk = () => {
        //fetchPosts(currentPage, size, false);
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
        const { status, data } = await deleteEntry(qa, '/posts', id);
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

    const handleSave = async (newPost) => {
        setIsLoading(true);
        const { status, data } = await (isCreating ? post : put)(qa, '/posts', newPost);
        if (status >= 200 && status < 300) {
            handleClose();
            handleOk();
        } else {
            handleError(data);
        }
    }

    return (
        <div className="container mt-4">
            <QuestionModal 
                isCreating={isCreating}
                show={ showModal } 
                content={ isCreating ? null : findPostById(id) }
                handleClose={handleClose} 
                handleCreate={handleSave} 
            />
            <DeleteConfirmation
                show={showDeleteConfirmation}
                onConfirm={ handleDeleteConfirmation }
                onCancel={() => setShowDeleteConfirmation(false)}
                message="Are you sure you want to delete this item?"
            />

            <div>
                <Row>
                    <Col md={12} className="d-flex justify-content-end mb-3">
                        <Button variant="success" onClick={handleAddNew}>
                            <FaPlus className="me-1" /> Add New Entry
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
                    columns={columns} 
                    anyActionColumn={true}
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
}

export default Question;
