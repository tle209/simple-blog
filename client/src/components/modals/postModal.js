import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
const PostModal = (props) =>{
    const {show, onHide, isUpdate, post} = props;
    const [formState, setUpdateForm] = useState({
        updatedArticle: {...post},
        isFormValid: false,
        isSubmitted: false
    });

    const handleValidation = (article) =>{
        console.log('article', article);
        const titleLength = article.title.length;
        const bodyLength = article.body.length;
        const rules = {
            title: {min: 10, max: 255},
            body: {min: 100},
        }
        let isValid = (titleLength < rules.title.min || titleLength > rules.title.max || bodyLength < rules.body.min)? false : true;
        setUpdateForm({...formState, isFormValid: isValid});
        return isValid;
    }

    const editArticle = async(event) => {
        setUpdateForm({...formState, isSubmitted: true});
        event.preventDefault();
        if (handleValidation(formState.updatedArticle)) {
            try {
                await axios.put(
                    `http://localhost:8000/api/v1/posts/${post._id}`, 
                    { 
                        title: formState.updatedArticle.title, 
                        body:formState.updatedArticle.body, 
                        author: formState.updatedArticle.author 
                    }
                );
                setUpdateForm({...formState, isSubmitted: false});
                onHide();
            } catch (error) {
                setUpdateForm({...formState, isSubmitted: false});
                throw error;
            } 
        } else {
            event.stopPropagation();
        }
    }

    const handleChange = async(event) => {
        setUpdateForm({ ...formState, updatedArticle: { ...formState.updatedArticle, [event.target.name]: event.target.value }});
        handleValidation(formState.updatedArticle)
        console.log('updatedArticle', formState.updatedArticle);
    }

    useEffect(()=> {
        if(_.isEmpty(formState.updatedArticle)) {
            setUpdateForm({ ...formState, updatedArticle: {...post} })
        }
    }, [formState, post])

    return (
        isUpdate 
        ? (
            <Modal {...{show, onHide}} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Update Article</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={editArticle}>
                    <Form.Group controlId="formUpdateArticle">
                        <Form.Label>Title</Form.Label><Form.Control name="title" type="text" placeholder="Enter title" value={formState.updatedArticle.title} onChange={handleChange} />
                        <Form.Label>Content</Form.Label><Form.Control name="body" type="text" placeholder="Enter content" value={formState.updatedArticle.body} onChange={handleChange} min={100} />
                        <Form.Label>Author</Form.Label><Form.Control name="author" type="text" placeholder="Enter content" defaultValue={formState.updatedArticle.author} disabled/>
                    </Form.Group>
                    {
                        !formState.isSubmitted 
                            ? ( <Button variant="primary" type="submit" value="Submit" disabled={!formState.isFormValid}>Update</Button> )
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
            <Modal {...{show, onHide}} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
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
              <Button variant="danger" onClick={() => editArticle(post._id)}>Delete</Button>
              <Button variant="secondary" onClick={() => onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        )
    )
}

export default PostModal;