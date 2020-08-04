const router = require('express').Router();
const {
    createComment, updateComment, getComments, deleteComment
} = require('../../services/comments');

router.post('/:postId/comments', createComment);
router.put('/:postId/comments/:commentId', updateComment);
router.get('/:postId/comments', getComments);
router.delete('/:postId/comments/:commentId', deleteComment);

module.exports = router;
