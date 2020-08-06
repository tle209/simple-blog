import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from "react-router";
import './article.scss';

const ArticleItem = () => {
    let { postId } = useParams();
    const [post, setPost] = useState({});
    const [isFetch, setIsFetch] = useState(false);

    const fetchPost = async() =>{
        try {
            const {data: {data}} = await axios(`http://localhost:8000/api/v1/posts/${postId}?page=1&limit=10`);
            setIsFetch(true);
            if(data) {
                return setPost({...data, ...post});
            }
        } catch (error) {
            throw error;
        }
    }
    
    useEffect(()=>{if(!isFetch) {fetchPost();}})

    return(
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">{post.title} - {post._id}</div>
                <div className="card-body">
                    <blockquote className="blockquote mb-0">
                        <p className="card-text">{post.body}</p>
                        <footer className="blockquote-footer">{post.author}</footer>
                    </blockquote>
                </div>
                <ul class="list-group list-group-flush">
                    {post.comments && post.comments.length > 0 
                    ? post.comments.map(comment => {
                        return (
                            <li className="list-group-item">
                                 <div className="card">
                                    <div className="card-header">{comment.author}</div>
                                    <div className="card-body mb-0">
                                        <p className="card-text">{comment.content}</p>
                                    </div>
                                 </div>
                            </li>
                        )
                    }) 
                    : <li className="list-group-item">{"Comment is empty. Please add new comment"}</li>
                    }
                </ul>
            </div>
        </div>
      );
}



export default ArticleItem;