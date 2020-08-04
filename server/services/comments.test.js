const {
    describe, it, before, after
} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('..');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
let testPostId = '';
let testCommentId = '';
chai.use(chaiHttp);

describe('Comments', () => {
    /**
     * Post comments
     */
    describe('POST Comments', () => {
        before((done) => {
            const postParams = {
                title: 'My test post',
                body: `This is my test post on comment. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server).post('/api/v1/posts').send(postParams).end((err, res) => {
                // eslint-disable-next-line no-underscore-dangle
                testPostId = res.body.data._id;
                done();
            });
        });
        it('should create a SINGLE comment on /api/v1/posts/<postId>/comments POST', (done) => {
            const commentParams = {
                content: 'This is my first comment on my test post. Please read carefully',
                author: 'thuanle'
            };
            chai.request(server)
                .post(`/api/v1/posts/${testPostId}/comments`)
                .send(commentParams)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('object');
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    res.body.data.should.have.property('_id');
                    res.body.data.should.have.property('post');
                    res.body.data.should.have.property('content');
                    res.body.data.should.have.property('author');
                    res.body.data.should.have.property('createdAt');
                    res.body.data.should.have.property('updatedAt');
                    // eslint-disable-next-line no-underscore-dangle
                    testCommentId = res.body.data._id;
                    done();
                });
        });

        it('should have new comment in post return', (done) => {
            chai.request(server).get(`/api/v1/posts/${testPostId}?page=1&limit=10`).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.be.a('object');
                res.body.data.comments.should.be.a('array');
                // eslint-disable-next-line no-underscore-dangle
                res.body.data.comments[0]._id.should.equal(testCommentId);
                done();
            });
        });

        it('should return 400 on /api/v1/posts/<postId>/comments POST with content empty', (done) => {
            const commentParams = {
                content: '',
                author: 'thuanle'
            };
            chai.request(server)
                .post(`/api/v1/posts/${testPostId}/comments`)
                .send(commentParams)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(10);
                    res.body.message[0].field.should.equal('content');
                    res.body.message[1].should.be.a('object');
                    res.body.message[1].code.should.equal(11);
                    res.body.message[1].field.should.equal('content');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId>/comments POST with content <20 chars', (done) => {
            const commentParams = {
                content: 'This is my first',
                author: 'thuanle'
            };
            chai.request(server)
                .post(`/api/v1/posts/${testPostId}/comments`)
                .send(commentParams)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('content');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId>/comments POST with content > 255 chars', (done) => {
            const commentParams = {
                content: `ViBnJMshVHxXqPf5fBgC7IVMedIRZyvGvW7zUj7mCXkZDntw9GpSMUznridiIY6J2DkO5wkx5wcVLA
                4Y3rpfe99WZ0pGBNJWPlskfCcMLr8BuAyueFyNJcx96ZcnXhMN191HZr5mxGdsDGxkD3azsEQWUAtnUhLwMELX1
                anqQKfEB3h1d5sZELFzeGzYWChKRgmdsjt8rhroldFCfh0wBmhzPw5wjbTkUWxwj1T3IXpgCUtTzqSsXE57eaaTo3vq`,
                author: 'thuanle'
            };
            chai.request(server)
                .post(`/api/v1/posts/${testPostId}/comments`)
                .send(commentParams)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('content');
                    done();
                });
        });

        it('should return 400 on /api/v1/posts/<postId>/comments POST with author empty', (done) => {
            const params = {
                content: 'This is my first comment on my test post. Please read carefully',
                author: ''
            };
            chai.request(server)
                .post(`/api/v1/posts/${testPostId}/comments`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(10);
                    res.body.message[0].field.should.equal('author');
                    res.body.message[1].should.be.a('object');
                    res.body.message[1].code.should.equal(11);
                    res.body.message[1].field.should.equal('author');
                    done();
                });
        });

        it('should return 400 on /api/v1/posts/<postId>/comments POST with author > 255 chars', (done) => {
            const params = {
                content: 'This is my first comment on my test post. Please read carefully',
                author: `ViBnJMshVHxXqPf5fBgC7IVMedIRZyvGvW7zUj7mCXkZDntw9GpSMUznridiIY6J2DkO5wkx5wcVLA
                4Y3rpfe99WZ0pGBNJWPlskfCcMLr8BuAyueFyNJcx96ZcnXhMN191HZr5mxGdsDGxkD3azsEQWUAtnUhLwMELX1
                anqQKfEB3h1d5sZELFzeGzYWChKRgmdsjt8rhroldFCfh0wBmhzPw5wjbTkUWxwj1T3IXpgCUtTzqSsXE57eaaTo3vq`
            };
            chai.request(server)
                .post(`/api/v1/posts/${testPostId}/comments`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('author');
                    done();
                });
        });
    });
    /**
     * GET Comments
     */
    describe('GET Comments', () => {
        it('should return ALL comments on /api/v1/posts/<postId>/comments GET', (done) => {
            chai.request(server)
                .get(`/api/v1/posts/${testPostId}/comments?page=1&limit=10`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    res.body.data.should.be.a('array');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId>/comments GET without pagination', (done) => {
            chai.request(server)
                .get(`/api/v1/posts/${testPostId}/comments`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.equal(false);
                    res.body.message[0].code.should.equal(17);
                    res.body.message[0].field.should.equal('page');
                    done();
                });
        });
    });
    /**
     * PUT Comments
     */
    describe('PUT Comments', () => {
        it('should update a SINGLE comment on /api/v1/posts/<postId>/comments/<commentId> PUT', (done) => {
            const commentParams = {
                content: 'This is my first comment on my test post. Please read carefully (updated)',
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}/comments/${testCommentId}`)
                .send(commentParams)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('object');
                    res.body.data.ok.should.equal(1);
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId>/comments/<commentId> PUT with content empty', (done) => {
            const commentParams = {
                content: '',
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}/comments/${testCommentId}`)
                .send(commentParams)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(10);
                    res.body.message[0].field.should.equal('content');
                    res.body.message[1].should.be.a('object');
                    res.body.message[1].code.should.equal(11);
                    res.body.message[1].field.should.equal('content');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId>/comments/<commentId> PUT with content <20 chars', (done) => {
            const commentParams = {
                content: 'This is my first',
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}/comments/${testCommentId}`)
                .send(commentParams)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('content');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId>/comments/<commentId> PUT with content > 255 chars', (done) => {
            const commentParams = {
                content: `ViBnJMshVHxXqPf5fBgC7IVMedIRZyvGvW7zUj7mCXkZDntw9GpSMUznridiIY6J2DkO5wkx5wcVLA
                4Y3rpfe99WZ0pGBNJWPlskfCcMLr8BuAyueFyNJcx96ZcnXhMN191HZr5mxGdsDGxkD3azsEQWUAtnUhLwMELX1
                anqQKfEB3h1d5sZELFzeGzYWChKRgmdsjt8rhroldFCfh0wBmhzPw5wjbTkUWxwj1T3IXpgCUtTzqSsXE57eaaTo3vq`,
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}/comments/${testCommentId}`)
                .send(commentParams)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('content');
                    done();
                });
        });

        it('should return 400 on /api/v1/posts/<postId>/comments/<commentId> PUT with author empty', (done) => {
            const params = {
                content: 'This is my first comment on my test post. Please read carefully',
                author: ''
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}/comments/${testCommentId}`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(10);
                    res.body.message[0].field.should.equal('author');
                    res.body.message[1].should.be.a('object');
                    res.body.message[1].code.should.equal(11);
                    res.body.message[1].field.should.equal('author');
                    done();
                });
        });

        it('should return 400 on /api/v1/posts/<postId>/comments/<commentId> PUT with author > 255 chars', (done) => {
            const params = {
                content: 'This is my first comment on my test post. Please read carefully',
                author: `ViBnJMshVHxXqPf5fBgC7IVMedIRZyvGvW7zUj7mCXkZDntw9GpSMUznridiIY6J2DkO5wkx5wcVLA
                4Y3rpfe99WZ0pGBNJWPlskfCcMLr8BuAyueFyNJcx96ZcnXhMN191HZr5mxGdsDGxkD3azsEQWUAtnUhLwMELX1
                anqQKfEB3h1d5sZELFzeGzYWChKRgmdsjt8rhroldFCfh0wBmhzPw5wjbTkUWxwj1T3IXpgCUtTzqSsXE57eaaTo3vq`
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}/comments/${testCommentId}`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('author');
                    done();
                });
        });
    });
    describe('DELETE Posts', () => {
        it('should delete a SINGLE post on /api/v1/posts/<postId>/comments/<commentId> DELETE', (done) => {
            chai.request(server)
                .delete(`/api/v1/posts/${testPostId}/comments/${testCommentId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    done();
                });
        });
        after((done) => {
            chai.request(server)
                .delete(`/api/v1/posts/${testPostId}`)
                .end(() => {
                    done();
                });
        });
    });
});
