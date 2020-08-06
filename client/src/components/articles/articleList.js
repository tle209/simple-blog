import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import './article.scss';

const ArticleList = () => {
    const [articles, setArticle] = useState([]);
    const [isFetch, setIsFetch] = useState(false);
    const fetchPosts = async() =>{
        try {
            const {data: {data}} = await axios('http://localhost:8000/api/v1/posts?page=1&limit=10');
            setIsFetch(true);
            if(data && data.length > 0) {
                return setArticle([...data, ...articles]);
            }
        } catch (error) {
            throw error;
        }
    }
    
    useEffect(()=>{
        if(!isFetch) {
            fetchPosts();
        }
    })

    return(
        <div className='container mt-5'>
            <div className="card-columns">
                {articles.length > 0 
                ? articles.map(post => {
                    return (
                        <div className="card">
                            <div className="card-header">{post.title} - <Link to={`/posts/${post._id}`}>{post._id}</Link></div>
                            <div className="card-body">
                                <blockquote className="blockquote mb-0">
                                    <p className="card-text">{post.body}</p>
                                    <footer className="blockquote-footer">{post.author}</footer>
                                </blockquote>
                            </div>
                            <footer className="card-footer">({post.comments.length}) comments</footer>
                        </div>
                    );
                })
                : <li>{"Article is empty. Please add new Article"}</li>}
            </div>
        </div>
      );
}



export default ArticleList;