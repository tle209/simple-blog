const router = require('express').Router();
const {
    createPost, updatePost, getPosts, getPost, deletePost
} = require('../../services/posts');

router.post('', createPost);
router.put('/:postId', updatePost);
router.get('', getPosts);
router.get('/:postId', getPost);
router.delete('/:postId', deletePost);

module.exports = router;
