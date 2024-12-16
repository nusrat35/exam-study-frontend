import { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Select from 'react-select';
import PropTypes from 'prop-types'; 

const QuestionModal = ({ isCreating, show, topic, content, subTopicOptions, handleClose, handleSave }) => {
    //const [showModal, setShowModal] = useState(show);
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
        // if (!engName) {
        //     setEngNameError('English title is required');
        //     return false;
        // }
        return true;
    }

    const handleModalClose = () => {
        init();
        handleClose();
    }

    const handleUpdate = async () => {
        if (!validate()) {
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
                                <Form.Group className="">
                                    <Form.Label className="required-field">Question (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Write Question"
                                        value={ questionEn }
                                        required
                                        maxLength={ 1024 }
                                        onChange={ (e) => setQuestionEn(e.target.value) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="">
                                    <Form.Label>Question (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Write Question"
                                        value={ questionBn }
                                        //required
                                        maxLength={ 512 }
                                        onChange={ (e) => setQuestionBn(e.target.value) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="">
                                    <Form.Label className="required-field">Option 1 (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Option 1"
                                        value={ option1?.valueEn }
                                        required
                                        maxLength={ 256 }
                                        onChange={ (e) => setOption1({ ...option1, valueEn: e.target.value }) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="">
                                    <Form.Label>Option 1 (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Option 1"
                                        value={ option1?.valueBn }
                                        //required
                                        maxLength={ 128 }
                                        onChange={ (e) => setOption1({ ...option1, valueBn: e.target.value }) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="">
                                    <Form.Label className="required-field">Option 2 (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Option 2"
                                        value={ option2?.valueEn }
                                        required
                                        maxLength={ 256 }
                                        onChange={ (e) => setOption2({ ...option2, valueEn: e.target.value }) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="">
                                    <Form.Label>Option 2 (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Option 2"
                                        value={ option2?.valueBn }
                                        //required
                                        maxLength={ 128 }
                                        onChange={ (e) => setOption2({ ...option2, valueBn: e.target.value }) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="">
                                    <Form.Label className="required-field">Option 3 (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Option 3"
                                        value={ option3?.valueEn }
                                        required
                                        maxLength={ 256 }
                                        onChange={ (e) => setOption3({ ...option3, valueEn: e.target.value }) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="">
                                    <Form.Label>Option 3 (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Option 3"
                                        value={ option3?.valueBn }
                                        //required
                                        maxLength={ 128 }
                                        onChange={ (e) => setOption3({ ...option3, valueBn: e.target.value }) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="">
                                    <Form.Label className="required-field">Option 4 (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Option 4"
                                        value={ option4?.valueEn }
                                        required
                                        maxLength={ 256 }
                                        onChange={ (e) => setOption4({ ...option4, valueEn: e.target.value }) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="">
                                    <Form.Label>Option 4 (Bangla)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Option 4"
                                        value={ option4?.valueBn }
                                        //required
                                        maxLength={ 128 }
                                        onChange={ (e) => setOption4({ ...option4, valueBn: e.target.value }) }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="" controlId="">
                                    <Form.Label className="required-field">Answer</Form.Label>
                                    <Select
                                        options={ansOptions}
                                        onChange={ (option) => setAnswer(option.value) }
                                        placeholder="Select Answer"
                                        value={ ansOptions.find(option => option.value === answer) }
                                        required
                                    />
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