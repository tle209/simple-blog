import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 


const CommentItem = ({comment}) =>{
    return (
        <li className="list-group-item">
             <div className="card">
                <div className="card-header"><FontAwesomeIcon icon={['far', 'comments']}/> {comment.author}</div>
                <div className="card-body mb-0">
                    <p className="card-text">{comment.content}</p>
                </div>
             </div>
        </li>
    )
}
export default CommentItem;