/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button, Modal, Form, Spinner
} from 'react-bootstrap';
import { createPost, updatePost, deletePost } from '../../lib/apis';

const PostModal = (props) => {
    const {
        modalShow, onHide, type, post = {}, articleTrackChange
    } = props;
    console.log('props', props);
    const [formState, setUpdateForm] = useState({
        updatedArticle: { ...post },
        isFormValid: false,
        isSubmitted: false
    });
    const history = useHistory();

    const handleValidation = ({ title = '', body = '', author = '' }) => {
        const titleLength = title.length;
        const bodyLength = body.length;
        const authorLength = author.length;
        const rules = {
            title: { min: 10, max: 255 },
            body: { min: 100 },
            author: { min: 2, max: 255 }
        };
        const isValid = !(
            (
                titleLength < rules.title.min
            || titleLength > rules.title.max
            || bodyLength < rules.body.min
            || authorLength < rules.author.min
            || authorLength > rules.author.max
            )
        );
        return isValid;
    };

    const handleChange = (event) => {
        const isValid = handleValidation(formState.updatedArticle);
        console.log('isValid', isValid);
        setUpdateForm({
            ...formState,
            updatedArticle: {
                ...formState.updatedArticle,
                [event.target.name]: event.target.value
            },
            isFormValid: isValid
        });
    };

    const handleCreateArticle = async (event) => {
        setUpdateForm({ ...formState, isSubmitted: true });
        event.preventDefault();
        if (handleValidation(formState.updatedArticle)) {
            try {
                await createPost(
                    {
                        title: formState.updatedArticle.title,
                        body: formState.updatedArticle.body,
                        author: formState.updatedArticle.author = 'anonymous'
                    }
                );
                setUpdateForm({ ...formState, isSubmitted: false });
                onHide();
                history.push('/');
            } catch (error) {
                setUpdateForm({ ...formState, isSubmitted: false });
                throw error;
            }
        }
    };

    /**
     * Edit article API
     */
    const handleEditArticle = async (event) => {
        setUpdateForm({ ...formState, isSubmitted: true });
        event.preventDefault();
        if (handleValidation(formState.updatedArticle)) {
            try {
                await updatePost(
                    post._id,
                    {
                        title: formState.updatedArticle.title,
                        body: formState.updatedArticle.body,
                        author: formState.updatedArticle.author
                    }
                );
                setUpdateForm({ ...formState, isSubmitted: false });
                articleTrackChange(formState.updatedArticle);
                onHide();
            } catch (error) {
                setUpdateForm({ ...formState, isSubmitted: false });
                throw error;
            }
        } else {
            event.stopPropagation();
        }
    };

    /**
     * Delete article API
     */
    const handleDeleteArticle = async () => {
        setUpdateForm({ ...formState, isSubmitted: true });
        try {
            await deletePost(post._id);
            setUpdateForm({ ...formState, isSubmitted: false });
            articleTrackChange(null);
            onHide();
        } catch (error) {
            setUpdateForm({ ...formState, isSubmitted: false });
            throw error;
        }
    };

    useEffect(() => {
        if (_.isEmpty(formState.updatedArticle) && type !== 'create') {
            setUpdateForm({ ...formState, updatedArticle: { ...post } });
        }
    }, [formState, post]);

    const modalType = () => {
        switch (type) {
        case 'create': {
            return (<Modal {...{ show: modalShow, onHide }} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Create Article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateArticle}>
                        <Form.Group controlId="formUpdateArticle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                name="title"
                                type="text"
                                placeholder="Enter title"
                                value={formState.updatedArticle.title}
                                onChange={handleChange}
                            />
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                name="body"
                                type="text"
                                placeholder="Enter content"
                                value={formState.updatedArticle.body}
                                onChange={handleChange}
                            />
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                name="author"
                                type="text"
                                placeholder="Enter content"
                                defaultValue={formState.updatedArticle.author}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {
                            !formState.isSubmitted
                                ? (<Button variant="primary" type="submit" value="Submit" disabled={!formState.isFormValid}>Create</Button>)
                                : (
                                    <Button variant="primary" type="submit" disabled>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        Loading...
                                    </Button>
                                )
                        }
                    </Form>
                </Modal.Body>
            </Modal>);
        }
        case 'update': {
            return (<Modal {...{ show: modalShow, onHide }} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Update Article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditArticle}>
                        <Form.Group controlId="formUpdateArticle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                name="title"
                                type="text"
                                placeholder="Enter title"
                                value={formState.updatedArticle.title}
                                onChange={handleChange}
                            />
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                name="body"
                                type="text"
                                placeholder="Enter content"
                                value={formState.updatedArticle.body}
                                onChange={handleChange}
                            />
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                name="author"
                                type="text"
                                placeholder="Enter content"
                                defaultValue={formState.updatedArticle.author}
                                disabled
                            />
                        </Form.Group>
                        {
                            !formState.isSubmitted
                                ? (<Button variant="primary" type="submit" value="Submit" disabled={!formState.isFormValid}>Update</Button>)
                                : (
                                    <Button variant="primary" type="submit" disabled>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                Loading...
                                    </Button>
                                )
                        }
                    </Form>
                </Modal.Body>
            </Modal>);
        }
        default: {
            return (<Modal {...{ show: modalShow, onHide }} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Delete Article
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure to want to delete this article?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    {
                        !formState.isSubmitted
                            ? <Button variant="danger" onClick={() => handleDeleteArticle(post._id)}>Delete</Button>
                            : <Button variant="danger" onClick={() => handleDeleteArticle(post._id)} disabled>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Deleting...
                            </Button>
                    }
                    <Button variant="secondary" onClick={() => onHide()}>Close</Button>
                </Modal.Footer>
            </Modal>);
        }
        }
    };
    return (modalType());
};

export default PostModal;
