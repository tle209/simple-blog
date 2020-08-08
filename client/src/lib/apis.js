import axios from 'axios';
import resolver from './apiResolver';

//* Post APIs *//
export async function createPost(post) {
    return resolver(axios.post('http://localhost:8000/api/v1/posts', post)).then((res) => res);
}

export async function updatePost(id, post) {
    return resolver(axios.put(`http://localhost:8000/api/v1/posts/${id}`, post)).then((res) => res);
}

export async function getPosts(page, limit) {
    return resolver(axios(`http://localhost:8000/api/v1/posts?page=${page}&limit=${limit}`)).then((res) => res);
}

export async function getPost(id, page, limit) {
    return resolver(axios(`http://localhost:8000/api/v1/posts/${id}?page=${page}&limit=${limit}`)).then((res) => res);
}

export async function deletePost(id) {
    return resolver(axios.delete(`http://localhost:8000/api/v1/posts/${id}`)).then((res) => res);
}

//* Comment APIs *//

export async function updateComment(postId, commentId, comment) {
    return resolver(axios.put(`http://localhost:8000/api/v1/posts/${postId}/comments/${commentId}`, comment)).then((res) => res);
}

export async function deleteComment(postId, commentId) {
    return resolver(axios.delete(`http://localhost:8000/api/v1/posts/${postId}/comments/${commentId}`)).then((res) => res);
}
