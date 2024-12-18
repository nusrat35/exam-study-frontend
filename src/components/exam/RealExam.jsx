import { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Accordion } from 'react-bootstrap';
import { get, post, put, qa } from '../../services/api';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-select';
import Confirmation from '../util/Confirmation';
import ToastNotification from '../util/ToastNotification';
import ExamQuestion from '../Question/ExamQuestion';
import { useParams, useNavigate } from 'react-router-dom';

const RealExam = () => {
    // State

    const { examId } = useParams(); // Retrieve the examId from the URL
    const navigate = useNavigate();

    const [id, setId] = useState(examId);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [date, setDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [jobPostOptions, setJobPostOptions] = useState([]);
    const [jobPost, setJobPost] = useState(null);
    const [examTakerOptions, setExamTakerOptions] = useState([]);
    const [examTaker, setExamTaker] = useState(null);
    const [totalQuestion, setTotalQuestion] = useState('');
    const [totalMark, setTotalMark] = useState('');
    const [allocatedTimeInMin, setAllocatedTimeInMin] = useState('');
    const [topics, setTopics] = useState([]);
    const [chosenQuestionCount, setChosenQuestionCount] = useState(0);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false); // To disable other elements

  // Handlers

    const loadPostOptions = async () => {
        const { status, data } = await get(qa, '/posts/dropdown');
        if (status === 200) {
            setJobPostOptions(data.map(post => ({ value: post.id, label: post.name })));
        }
    }

    const loadExamTakerOptions = async () => {
        const { status, data } = await get(qa, '/exam-takers/dropdown');
        if (status === 200) {
            setExamTakerOptions(data.map(examTaker => ({ value: examTaker.id, label: examTaker.name })));
        }
    }

    const loadTopics = async () => {
        const { status, data } = await get(qa, `/topics`);
        if (status === 200) {
            setTopics(data);
        }
    }

    const loadExam = async () => {
        setIsLoading(true);
        const { status, data } = await get(qa, `/exams/${examId}`);
        if (status === 200) {
            setId(data.id);
            setName(data.name);
            setDate(data.startTime?.split(' ')[0] || '');
            setJobPost(data.post?.id || '');
            setExamTaker(data.examTaker?.id || '');
            setTotalQuestion(data.totalQuestions || '');
            setTotalMark(data.totalMarks || '');

            handleOk(data);
        }
    }

    useEffect(() => {
        loadPostOptions();
        loadExamTakerOptions();
        if (examId) {
            loadExam();
            loadTopics();
        }

    }, [examId]);

    const handleOk = (response, successCallback) => {
        setTimeout(() => {
            setIsLoading(false);
            if (successCallback) {
                successCallback(response);
            }
        }, 1000);
    }

    const handleError = (error, errorCallback) => {
        setTimeout(() => {
            setIsLoading(false);
            console.error(error);
            if (errorCallback) {
                errorCallback();
            }
        }, 500);
    }

    const handleClose = () => {
        setShowConfirmation(false);
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString + ' 00:00';
    };

    const getExamRequest = () => {
        return {
            id,
            name,
            startTime: formatDate(date),
            examType: 'REAL',
            totalQuestions: totalQuestion,
            totalMarks: totalMark,
            postId: jobPost,
            examTakerId: examTaker,
        }
    }

    const handleToastClose = () => {
        setShowToast(false);
        setIsDisabled(false);
        
        if (!examId) {
            navigate(`/exam/${id}`);
        }
    }

    const saveExam = async () => {
        setShowConfirmation(false);
        setIsLoading(true);

        const examRequest = getExamRequest();
        const { status, data } = await (id ? put : post)(qa, '/exams', examRequest);
        if (status >= 200 && status < 300) {
            handleOk(data, (response) => {
                setShowToast(true);
                setIsDisabled(true);
                setId(response.id);
            });
        } else if (status === 400) {
            handleError(data);
        } else {
            handleError(data);
        }
    }

    const handleSaveExam = async (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    }

    // if (isLoading) {
    //     return <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
    //         <Spinner animation="border" variant="primary" />
    //     </div> 
    // }

    return (
        <div style={{ position: 'relative' }}>
            <Confirmation
                show={ showConfirmation }
                onConfirm={ saveExam }
                onCancel={ handleClose }
                
            />
            <ToastNotification
                show={ showToast }
                onClose={ handleToastClose }
                title="Success"
                message={ examId ? 'Exam updated successfully!' : 'Exam created successfully!' }
            />
            <div 
                className="container mt-4" 
                style={{
                    pointerEvents: isDisabled ? 'none' : 'auto', // Disable all interactions
                    opacity: isDisabled ? 0.5 : 1, // Make content appear "disabled"
                }}
            >
                {isLoading && <div className="d-flex justify-content-center mt-100">
                    <Spinner animation="border" variant="primary" />
                </div>}
                <div className="exam-section">
                    <div className="exam-section-header mb-3">
                        <h3>Exam Details</h3>
                    </div>
                    <Form hidden={ isLoading } onSubmit={ handleSaveExam }>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="" controlId="formBasicEmail">
                                    <Form.Label className="required-field">Exam Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        maxLength={ 127 }
                                        placeholder="Enter Exam Name" 
                                        required
                                        value={ name }
                                        onChange={ (e) => setName(e.target.value) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>Exam Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Enter Exam Date"
                                        value={ date }
                                        onChange={ (e) => setDate(e.target.value) }
                                    /> 
                                </Form.Group> 
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>Post</Form.Label>
                                    <Select
                                        options={jobPostOptions}
                                        onChange={ (option) => setJobPost(option.value) }
                                        placeholder="Select Post"
                                        value={ jobPostOptions.find(option => option.value === jobPost) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>Exam Taker</Form.Label>
                                    <Select
                                        options={examTakerOptions}
                                        onChange={ (option) => setExamTaker(option.value) }
                                        placeholder="Select Exam Taker"
                                        value={ examTakerOptions.find(option => option.value === examTaker) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="" controlId="">
                                    <Form.Label className="required-field">Total Question</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter Total Question" 
                                        required
                                        min={ 1 }
                                        value={ totalQuestion }
                                        onChange={ (e) => setTotalQuestion(e.target.value) }
                                    />  
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="" controlId="">
                                    <Form.Label>Total Mark</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter Total Mark" 
                                        value={ totalMark }
                                        onChange={ (e) => setTotalMark(e.target.value) }
                                    />  
                                </Form.Group>
                            </Col>
                            <Col md={4} className="d-flex justify-content-start align-items-center">
                                <Form.Group className="" controlId="">
                                    <Button 
                                        type="submit"
                                        variant="primary" 
                                        //onClick={ handleCreateExam }
                                    >
                                        { examId ? 'Update Exam' : 'Create Exam' }
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </div>
                { examId && (
                    <div className="question-section mt-5">
                        <div className="question-section-header mb-3">
                            <h3>Questions ({chosenQuestionCount})</h3>
                        </div>
                        <div className="question-section-body">
                            <ExamQuestion 
                                examId={ +examId } 
                                topics={ topics } 
                                handleChosenQuestionCount={ count => setChosenQuestionCount(count) }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealExam;
