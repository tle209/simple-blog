/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import CommentItem from '../comments/commentItem';
import PostModal from '../modals/postModal';
import { getPost } from '../../lib/apis';
import './article.scss';

const ArticleItem = () => {
    const timeFormat = 'DD-MM-YYYY HH:mm:ss';
    const { postId } = useParams();
    const [state, setSate] = useState({
        post: {},
        isFetch: false,
        modalShow: false,
        type: '',
        pagination: {}
    });
    const history = useHistory();

    const fetchPost = async (page = 1, limit = 10) => {
        const { response, pagination } = await getPost(postId, page, limit);
        if (response) {
            setSate({
                ...state, isFetch: true, post: { ...response }, pagination: { ...pagination }
            });
        }
    };

    const showModalType = (type) => {
        setSate({ ...state, modalShow: true, type });
    };

    const articleTrackChange = (article) => {
        if (_.isEmpty(article) && !state.isUpdated) {
            history.push('/');
        }
        if (article !== state.post) {
            setSate({ ...state, post: { ...article } });
        }
    };

    const commentTrackChange = () => {
        fetchPost();
    };

    useEffect(() => {
        if (!state.isFetch) {
            fetchPost();
        }
    }, [state.isFetch]);

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header row justify-content-between">
                    <div className='col-md-8'>
                        <FontAwesomeIcon icon={['far', 'newspaper']}/> {state.post.title}
                    </div>
                    <div className='col-md-2'>
                        <Button variant="danger" className='margin-right button-align-right' onClick={() => showModalType('delete')}>
                            <FontAwesomeIcon icon={['far', 'trash-alt']}/>
                        </Button>
                        <Button variant="primary" className='margin-right button-align-right' onClick={() => showModalType('update')}>
                            <FontAwesomeIcon icon={['far', 'edit']}/>
                        </Button>
                    </div>
                </div>
                <div className="card-body">
                    <blockquote className="blockquote mb-0">
                        <p className="card-text">{state.post.body}</p>
                        <footer className="blockquote-footer">
                            {state.post.author} - <small>{moment(state.post.updatedAt).format(timeFormat)}</small>
                        </footer>
                    </blockquote>
                </div>
                <div className="card-footer">
                    <Button variant="primary" onClick={() => console.log('create comment')}>
                        Create comment
                    </Button>
                </div>
                <ul className="list-group list-group-flush">
                    {state.post.comments && state.post.comments.length > 0
                        // eslint-disable-next-line no-underscore-dangle
                        ? state.post.comments.map((comment) => <CommentItem
                            key={comment._id}
                            postId={state.post._id}
                            comment={comment}
                            commentTrackChange={commentTrackChange}
                        />)
                        : <li className="list-group-item">{'Comment is empty. Please add new comment'}</li>
                    }
                </ul>
            </div>
            { state.isFetch
                ? <PostModal
                    modalShow={state.modalShow}
                    onHide={() => setSate({ ...state, modalShow: false })}
                    type={state.type}
                    post={state.post}
                    articleTrackChange={articleTrackChange}
                />
                : ''}
        </div>
    );
};

export default ArticleItem;
