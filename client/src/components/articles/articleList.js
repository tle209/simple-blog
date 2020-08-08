/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPosts } from '../../lib/apis';
import './article.scss';

const ArticleList = () => {
    const timeFormat = 'DD-MM-YYYY HH:mm:ss';
    const [state, setState] = useState({
        articles: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 12,
            totalPage: 0
        },
        isFetch: false,
    });

    const fetchPosts = async () => {
        const { response, pagination } = await getPosts(state.pagination.page, state.pagination.limit);
        if (response.length > 0) {
            setState({
                ...state,
                articles: [...response],
                pagination: { ...pagination, totalPage: Math.ceil(pagination.total / pagination.limit) },
                isFetch: true,
            });
        }
    };

    const handleChangePage = async (e, i) => {
        const { response } = await getPosts(i, state.pagination.limit);
        if (response.length > 0) {
            setState({
                ...state,
                articles: [...response],
                pagination: { ...state.pagination, page: i }
            });
        }
    };

    useEffect(() => {
        if (!state.isFetch) {
            fetchPosts();
        }
    }, [state.isFetch]);
    return (
        <div className='container mt-5'>
            <div className="card-columns">
                {state.articles.length > 0
                    ? state.articles.map((post) => (
                        <div key={post._id} className="card">
                            <div className="card-header"><FontAwesomeIcon icon={['far', 'newspaper']}/> {post.title}</div>
                            <div className="card-body">
                                <blockquote className="blockquote mb-0">
                                    <p className="card-text">{post.body}</p>
                                    <footer className="blockquote-footer">
                                        {post.author} - <small>{moment(post.updatedAt).format(timeFormat)}</small>
                                    </footer>
                                </blockquote>
                            </div>
                            <footer className="card-footer">
                                <FontAwesomeIcon icon={['far', 'comments']}/>
                                <Link to={`/posts/${post._id}`}>({post.comments.length}) comments</Link>
                            </footer>
                        </div>
                    ))
                    : <p>{'Article is empty. Please add new Article'}</p>}
            </div>
            <Pagination>
                <Pagination.First onClick={(e) => handleChangePage(e, 0)} href='#'/>
                <Pagination.Prev onClick={(e) => handleChangePage(e, state.pagination.page - 1)} href='#'/>
                {
                    [...Array(state.pagination.totalPage)].map((page, i) => (
                        <Pagination.Item active={i + 1 === state.pagination.page} key={i} onClick={(e) => handleChangePage(e, i + 1)} href='#'>
                            {i + 1}
                        </Pagination.Item>
                    ))
                }
                <Pagination.Next onClick={(e) => handleChangePage(e, state.pagination.page + 1)} href='#'/>
                <Pagination.Last onClick={(e) => handleChangePage(e, state.pagination.totalPage - 1)} href='#'/>
            </Pagination>
        </div>
    );
};

export default ArticleList;
