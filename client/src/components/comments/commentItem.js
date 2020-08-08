/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommentModal from '../modals/commentModal';

const CommentItem = ({ postId, comment, commentTrackChange }) => {
    const timeFormat = 'DD-MM-YYYY HH:mm:ss';
    const [state, setSate] = useState({
        modalShow: false,
        isDelete: true,
        pagination: {}
    });

    const showModalType = (type) => {
        if (type === 'update') {
            setSate({ ...state, modalShow: true, isDelete: false });
        } else {
            setSate({ ...state, modalShow: true, isDelete: true });
        }
    };

    return (
        <li className="list-group-item">
            <div className="card">
                <div className="row justify-content-between card-header">
                    <div className='col-md-8'>
                        <FontAwesomeIcon icon={['far', 'comments']}/> {comment.author}
                        <small>({moment(comment.updatedAt).format(timeFormat)})</small></div>
                    <div className='col-md-2'>
                        <Button variant="danger" className='margin-right button-align-right' onClick={() => showModalType('delete')}>
                            <FontAwesomeIcon icon={['far', 'trash-alt']}/>
                        </Button>
                        <Button variant="primary" className='margin-right button-align-right' onClick={() => showModalType('update')}>
                            <FontAwesomeIcon icon={['far', 'edit']}/>
                        </Button>
                    </div>
                </div>
                <div className="card-body mb-0">
                    <p className="card-text">{comment.content}</p>
                </div>
                <CommentModal
                    modalShow={state.modalShow}
                    onHide={() => setSate({ ...state, modalShow: false })}
                    isDelete={state.isDelete}
                    comment={comment}
                    commentTrackChange={commentTrackChange}
                    postId={postId}
                />

            </div>
        </li>
    );
};
export default CommentItem;
