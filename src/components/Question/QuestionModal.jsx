import { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Select from 'react-select';
import PropTypes from 'prop-types'; 

const QuestionModal = ({ isCreating, show, topic, content, subTopicOptions, handleClose, handleSave }) => {
    //const [showModal, setShowModal] = useState(show);
    const formStyle = {
        marginBottom: '5px',
    };
    
    const [subTopic, setSubTopic] = useState(null);
    const [id, setId] = useState(null);
    const [questionEn, setQuestionEn] = useState('');
    const [questionBn, setQuestionBn] = useState('');
    
    const emptyOption = {
        id: null,
        questionId: null,
        serial: null,
        valueEn: '',
        valueBn: '',
    };
    
    const [option1, setOption1] = useState({...emptyOption, serial: 1});
    const [option2, setOption2] = useState({...emptyOption, serial: 2});
    const [option3, setOption3] = useState({...emptyOption, serial: 3});
    const [option4, setOption4] = useState({...emptyOption, serial: 4});

    const emptyError = {
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
    };
    const [error, setError] = useState(emptyError);


    const [answer, setAnswer] = useState(null);


    const ansOptions = [
        { value: 1, label: 'Option 1' },
        { value: 2, label: 'Option 2' },
        { value: 3, label: 'Option 3' },
        { value: 4, label: 'Option 4' },
    ];

    const init = () => {
        setSubTopic(null);
        setId(null);
        setQuestionEn('');
        setQuestionBn('');
        setOption1({...emptyOption, serial: 1});
        setOption2({...emptyOption, serial: 2});
        setOption3({...emptyOption, serial: 3});
        setOption4({...emptyOption, serial: 4});
        setAnswer(null);
        setError(emptyError);
    }

    useEffect(() => {
        if (!show) {
            return;
        }

        if (isCreating) {
            init();
        } else if (content) {
            const question = content.question;
            setSubTopic(question.topic?.id);
            setId(content.id);
            setQuestionEn(question.questionEn);
            setQuestionBn(question.questionBn);

            const options = question.options;
            setOption1(options.find(option => option.serial === 1));
            setOption2(options.find(option => option.serial === 2));
            setOption3(options.find(option => option.serial === 3));
            setOption4(options.find(option => option.serial === 4));
            setAnswer(question.mcqAns);
        } else {
            init();
        }
    }, [show, isCreating, content]);

    const validate = () => {
        const newErrors = {};
        if (!questionEn && !questionBn) {
            newErrors.question = 'Question is required. Fill at least one language';
        }
        if (!option1.valueEn && !option1.valueBn) {
            newErrors.option1 = 'Option 1 is required. Fill at least one language';
        }
        if (!option2.valueEn && !option2.valueBn) {
            newErrors.option2 = 'Option 2 is required. Fill at least one language';
        }
        if (!option3.valueEn && !option3.valueBn) {
            newErrors.option3 = 'Option 3 is required. Fill at least one language';
        }
        if (!option4.valueEn && !option4.valueBn) {
            newErrors.option4 = 'Option 4 is required. Fill at least one language';
        }
        if (!answer) {
            newErrors.answer = 'Answer is required';
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleModalClose = () => {
        init();
        handleClose();
    }

    const handleUpdate = async () => {
        if (!validate()) {
            console.error('error: ', error);
            return;
        }

        const question = {
            id: content?.question?.id || null,
            topicId: subTopic || topic.id,
            questionEn,
            questionBn,
            optionRequests: [option1, option2, option3, option4],
            mcqAns: answer,
        };

        handleSave(question);
    }

    if (show === false) {
        console.log('show is false');
        return null;
    }

    return (
        <>
            <Modal size="xl" show={ show } onHide={ handleModalClose }>
                <Modal.Header closeButton >
                    <Modal.Title>{ isCreating ? 'New Question' : 'Edit Question' }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>Sub Topic</Form.Label>
                                    <Select
                                        options={subTopicOptions}
                                        onChange={ (option) => setSubTopic(option.value) }
                                        placeholder="Select Sub Topic"
                                        value={ subTopicOptions.find(option => option.value === subTopic) }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Question (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Write Question"
                                        value={ questionEn }
                                        required
                                        maxLength={ 1024 }
                                        onChange={ (e) => setQuestionEn(e.target.value) }
                                        isInvalid={ !!error.question }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.question }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Question (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Write Question"
                                        value={ questionBn }
                                        //required
                                        maxLength={ 512 }
                                        onChange={ (e) => setQuestionBn(e.target.value) }
                                        isInvalid={ !!error.question }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.question }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Option 1 (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Option 1"
                                        value={ option1?.valueEn }
                                        required
                                        maxLength={ 256 }
                                        onChange={ (e) => setOption1({ ...option1, valueEn: e.target.value }) }
                                        isInvalid={ !!error.option1 }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.option1 }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Option 1 (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Option 1"
                                        value={ option1?.valueBn }
                                        //required
                                        maxLength={ 128 }
                                        onChange={ (e) => setOption1({ ...option1, valueBn: e.target.value }) }
                                        isInvalid={ !!error.option1 }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.option1 }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Option 2 (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Option 2"
                                        value={ option2?.valueEn }
                                        required
                                        maxLength={ 256 }
                                        onChange={ (e) => setOption2({ ...option2, valueEn: e.target.value }) }
                                        isInvalid={ !!error.option2 }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.option2 }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Option 2 (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Option 2"
                                        value={ option2?.valueBn }
                                        //required
                                        maxLength={ 128 }
                                        onChange={ (e) => setOption2({ ...option2, valueBn: e.target.value }) }
                                        isInvalid={ !!error.option2 }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.option2 }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Option 3 (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Option 3"
                                        value={ option3?.valueEn }
                                        required
                                        maxLength={ 256 }
                                        onChange={ (e) => setOption3({ ...option3, valueEn: e.target.value }) }
                                        isInvalid={ !!error.option3 }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.option3 }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Option 3 (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Option 3"
                                        value={ option3?.valueBn }
                                        //required
                                        maxLength={ 128 }
                                        onChange={ (e) => setOption3({ ...option3, valueBn: e.target.value }) }
                                        isInvalid={ !!error.option3 }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.option3 }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Option 4 (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Option 4"
                                        value={ option4?.valueEn }
                                        required
                                        maxLength={ 256 }
                                        onChange={ (e) => setOption4({ ...option4, valueEn: e.target.value }) }
                                        isInvalid={ !!error.option4 }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.option4 }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="required-field">Option 4 (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        style={ formStyle }
                                        placeholder="Option 4"
                                        value={ option4?.valueBn }
                                        //required
                                        maxLength={ 128 }
                                        onChange={ (e) => setOption4({ ...option4, valueBn: e.target.value }) }
                                        isInvalid={ !!error.option4 }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.option4 }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label className="required-field">Answer</Form.Label>
                                    <Select
                                        options={ansOptions}
                                        onChange={ (option) => setAnswer(option.value) }
                                        placeholder="Select Answer"
                                        value={ ansOptions.find(option => option.value === answer) }
                                        required
                                        isInvalid={ !!error.answer }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { error.answer }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleUpdate}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

QuestionModal.propTypes = {
    isCreating: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    topic: PropTypes.object.isRequired,
    content: PropTypes.object,
    subTopicOptions: PropTypes.array.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
};

export default QuestionModal;