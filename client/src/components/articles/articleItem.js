import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from 'react-bootstrap';
import CommentItem from '../comments/commentItem';
import PostModal from '../modals/postModal';

import './article.scss';

const ArticleItem = () => {
    let { postId } = useParams();
    const [post, setPost] = useState({});
    const [isFetch, setIsFetch] = useState(false);
    const [show, setModalShow] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const fetchPost = async() => {
        try {
            const {data: {data}} = await axios(`http://localhost:8000/api/v1/posts/${postId}?page=1&limit=10`);
            setIsFetch(true);
            if(data) {
                return setPost({...data});
            }
        } catch (error) {
            throw error;
        }
    }

    const showModalUpdate = (type) =>{
        if(type === 'update') { setIsUpdated(true); } else { setIsUpdated(false); }
        return setModalShow(true);
    }
    
    useEffect(()=>{if(!isFetch) {fetchPost();}})

    return(
        <div className="container mt-5">
            <div className="card">
                <div className="card-header row justify-content-between">
                    <div className='col-md-8'>
                        <FontAwesomeIcon icon={['far', 'newspaper']}/> {post.title}
                    </div>
                    <div className='col-md-2'>
                        <Button variant="danger" className='margin-right button-align-right' onClick={() => showModalUpdate('delete')}><FontAwesomeIcon icon={['far', 'trash-alt']}/></Button>
                        <Button variant="primary" className='margin-right button-align-right' onClick={() => showModalUpdate('update')}><FontAwesomeIcon icon={['far', 'edit']}/></Button>
                    </div>
                </div>
                <div className="card-body">
                    <blockquote className="blockquote mb-0">
                        <p className="card-text">{post.body}</p>
                        <footer className="blockquote-footer">{post.author}</footer>
                    </blockquote>
                </div>
                <ul className="list-group list-group-flush">
                    {post.comments && post.comments.length > 0 
                    ? post.comments.map(comment => {
                        return (<CommentItem key={comment._id} comment={comment} />)
                    }) 
                    : <li className="list-group-item">{"Comment is empty. Please add new comment"}</li>
                    }
                </ul>
            </div>
            { isFetch ? <PostModal show={show} onHide={()=>setModalShow(false)} isUpdate={isUpdated} post={post}/> : ''}   
        </div>
      );
}



export default ArticleItem;