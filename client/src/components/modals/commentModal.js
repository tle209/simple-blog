/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
    Button, Modal, Form, Spinner
} from 'react-bootstrap';
import { updateComment, deleteComment } from '../../lib/apis';

const CommentModal = (props) => {
    const {
        modalShow, onHide, isDelete, comment, commentTrackChange, postId
    } = props;
    const [formState, setUpdateForm] = useState({
        updatedComment: { ...comment },
        isFormValid: false,
        isSubmitted: false
    });

    const handleValidation = (item) => {
        const contentLength = item.content.length;
        const rules = {
            content: { min: 20, max: 255 },
        };
        const isValid = !((contentLength < rules.content.min || contentLength > rules.content.max));
        return isValid;
    };

    /**
     * Edit article API
     */
    const handleUpdateComment = async (event) => {
        setUpdateForm({ ...formState, isSubmitted: true });
        event.preventDefault();
        if (handleValidation(formState.updatedComment)) {
            try {
                await updateComment(
                    postId,
                    comment._id,
                    {
                        content: formState.updatedComment.content,
                        author: formState.updatedComment.author
                    }
                );
                setUpdateForm({ ...formState, isSubmitted: false });
                commentTrackChange(formState.updatedComment);
                onHide();
            } catch (error) {
                setUpdateForm({ ...formState, isSubmitted: false });
                throw error;
            }
        } else {
            event.stopPropagation();
        }
    };

    const handleChange = (event) => {
        const isValid = handleValidation(formState.updatedComment);
        setUpdateForm({
            ...formState,
            updatedComment: { ...formState.updatedComment, [event.target.name]: event.target.value },
            isFormValid: isValid
        });
    };

    /**
     * Delete article API
     */
    const handleDeleteComment = async () => {
        setUpdateForm({ ...formState, isSubmitted: true });
        try {
            await deleteComment(postId, comment._id);
            setUpdateForm({ ...formState, isSubmitted: false });
            commentTrackChange(null);
            onHide();
        } catch (error) {
            setUpdateForm({ ...formState, isSubmitted: false });
            throw error;
        }
    };

    useEffect(() => {
        if (_.isEmpty(formState.updatedComment)) {
            setUpdateForm({ ...formState, updatedComment: { ...comment } });
        }
    }, [formState, comment]);

    return (
        !isDelete
            ? (
                <Modal {...{ show: modalShow, onHide }} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Update Article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdateComment}>
                            <Form.Group controlId="formUpdateArticle">
                                <Form.Label>Content</Form.Label>
                                <Form.Control
                                    name="content"
                                    type="text"
                                    placeholder="Enter content"
                                    value={formState.updatedComment.content}
                                    onChange={handleChange}
                                />
                                <Form.Label>Author</Form.Label>
                                <Form.Control
                                    name="author"
                                    type="text"
                                    placeholder="Enter content"
                                    defaultValue={formState.updatedComment.author}
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
                </Modal>
            )
            : (
                <Modal {...{ show: modalShow, onHide }} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Delete Comment
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Are you sure to want to delete this comment?
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        {
                            !formState.isSubmitted
                                ? <Button variant="danger" onClick={() => handleDeleteComment(comment._id)}>Delete</Button>
                                : <Button variant="danger" onClick={() => handleDeleteComment(comment._id)} disabled>
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
                </Modal>
            )
    );
};

export default CommentModal;
