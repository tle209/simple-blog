const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('..');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
let testPostId = '';
chai.use(chaiHttp);

describe('Posts', () => {
    describe('POST Posts', () => {
        it('should create a SINGLE post on /api/v1/posts POST', (done) => {
            const params = {
                title: 'My test post',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server)
                .post('/api/v1/posts')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('object');
                    res.body.data.comments.should.be.a('array');
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    res.body.data.should.have.property('_id');
                    res.body.data.should.have.property('title');
                    res.body.data.should.have.property('body');
                    res.body.data.should.have.property('author');
                    res.body.data.should.have.property('createdAt');
                    res.body.data.should.have.property('updatedAt');
                    res.body.data.title.should.equal(params.title);
                    res.body.data.body.should.equal(params.body);
                    res.body.data.author.should.equal(params.author);
                    // eslint-disable-next-line no-underscore-dangle
                    testPostId = res.body.data._id;
                    done();
                });
        });
        it('should return 400 on /api/v1/posts POST with title empty', (done) => {
            const params = {
                title: '',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server)
                .post('/api/v1/posts')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(10);
                    res.body.message[0].field.should.equal('title');
                    res.body.message[1].should.be.a('object');
                    res.body.message[1].code.should.equal(11);
                    res.body.message[1].field.should.equal('title');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts POST with title <10 chars', (done) => {
            const params = {
                title: 'My',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server)
                .post('/api/v1/posts')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('title');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts POST with title > 255 chars', (done) => {
            const params = {
                title: `ViBnJMshVHxXqPf5fBgC7IVMedIRZyvGvW7zUj7mCXkZDntw9GpSMUznridiIY6J2DkO5wkx5wcVLA
                4Y3rpfe99WZ0pGBNJWPlskfCcMLr8BuAyueFyNJcx96ZcnXhMN191HZr5mxGdsDGxkD3azsEQWUAtnUhLwMELX1
                anqQKfEB3h1d5sZELFzeGzYWChKRgmdsjt8rhroldFCfh0wBmhzPw5wjbTkUWxwj1T3IXpgCUtTzqSsXE57eaaTo3vq`,
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server)
                .post('/api/v1/posts')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('title');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts POST with body < 100 chars', (done) => {
            const params = {
                title: 'My test post',
                body: 'This is my test post. Please read carefully.',
                author: 'thuanle'
            };
            chai.request(server)
                .post('/api/v1/posts')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('body');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts POST with author empty', (done) => {
            const params = {
                title: 'My test post',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: ''
            };
            chai.request(server)
                .post('/api/v1/posts')
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
        it('should return 400 on /api/v1/posts POST with author > 255 chars', (done) => {
            const params = {
                title: 'My test post',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: `ViBnJMshVHxXqPf5fBgC7IVMedIRZyvGvW7zUj7mCXkZDntw9GpSMUznridiIY6J2DkO5wkx5wcVLA
                4Y3rpfe99WZ0pGBNJWPlskfCcMLr8BuAyueFyNJcx96ZcnXhMN191HZr5mxGdsDGxkD3azsEQWUAtnUhLwMELX1
                anqQKfEB3h1d5sZELFzeGzYWChKRgmdsjt8rhroldFCfh0wBmhzPw5wjbTkUWxwj1T3IXpgCUtTzqSsXE57eaaTo3vq`
            };
            chai.request(server)
                .post('/api/v1/posts')
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
    describe('GET Posts', () => {
        it('should return ALL posts on /api/v1/posts GET', (done) => {
            chai.request(server)
                .get('/api/v1/posts?page=1&limit=10')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    res.body.data.should.be.a('array');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts GET without pagination', (done) => {
            chai.request(server)
                .get('/api/v1/posts')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.equal(false);
                    res.body.message[0].code.should.equal(17);
                    res.body.message[0].field.should.equal('page');
                    done();
                });
        });
        it('should return a SINGLE post on /api/v1/post/<postId> GET', (done) => {
            chai.request(server)
                .get(`/api/v1/posts/${testPostId}?page=1&limit=10`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    res.body.data.should.be.a('object');
                    res.body.data.comments.should.be.a('array');
                    done();
                });
        });
        it('should return 400 on /post/<postId> GET without pagination', (done) => {
            chai.request(server)
                .get(`/api/v1/posts/${testPostId}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.equal(false);
                    res.body.message[0].code.should.equal(17);
                    res.body.message[0].field.should.equal('page');
                    done();
                });
        });
    });
    describe('PUT Posts', () => {
        it('should update a SINGLE post on /api/v1/posts/<postId> PUT', (done) => {
            const params = {
                title: 'My test post (updated)',
                body: `This is my test update post. Please read carefully. I have create a new simple blog with simple functions\n.
                The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('object');
                    res.body.data.nModified.should.equal(1);
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId> PUT with title empty', (done) => {
            const params = {
                title: '',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(10);
                    res.body.message[0].field.should.equal('title');
                    res.body.message[1].should.be.a('object');
                    res.body.message[1].code.should.equal(11);
                    res.body.message[1].field.should.equal('title');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId> PUT with title <10 chars', (done) => {
            const params = {
                title: 'My',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('title');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId> PUT with title > 255 chars', (done) => {
            const params = {
                title: `ViBnJMshVHxXqPf5fBgC7IVMedIRZyvGvW7zUj7mCXkZDntw9GpSMUznridiIY6J2DkO5wkx5wcVLA
                4Y3rpfe99WZ0pGBNJWPlskfCcMLr8BuAyueFyNJcx96ZcnXhMN191HZr5mxGdsDGxkD3azsEQWUAtnUhLwMELX1
                anqQKfEB3h1d5sZELFzeGzYWChKRgmdsjt8rhroldFCfh0wBmhzPw5wjbTkUWxwj1T3IXpgCUtTzqSsXE57eaaTo3vq`,
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('title');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId> PUT with body < 100 chars', (done) => {
            const params = {
                title: 'My test post',
                body: 'This is my test post. Please read carefully.',
                author: 'thuanle'
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}`)
                .send(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(false);
                    res.body.message.should.be.a('array');
                    res.body.message[0].should.be.a('object');
                    res.body.message[0].code.should.equal(11);
                    res.body.message[0].field.should.equal('body');
                    done();
                });
        });
        it('should return 400 on /api/v1/posts/<postId> PUT with author empty', (done) => {
            const params = {
                title: 'My test post',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: ''
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}`)
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
        it('should return 400 on /api/v1/posts/<postId> PUT with author > 255 chars', (done) => {
            const params = {
                title: 'My test post',
                body: `This is my test post. Please read carefully. I have create a new simple blog with simple functions\n.
                    The first functions is: Create post\n. And the second is: Create comment`,
                author: `ViBnJMshVHxXqPf5fBgC7IVMedIRZyvGvW7zUj7mCXkZDntw9GpSMUznridiIY6J2DkO5wkx5wcVLA
                4Y3rpfe99WZ0pGBNJWPlskfCcMLr8BuAyueFyNJcx96ZcnXhMN191HZr5mxGdsDGxkD3azsEQWUAtnUhLwMELX1
                anqQKfEB3h1d5sZELFzeGzYWChKRgmdsjt8rhroldFCfh0wBmhzPw5wjbTkUWxwj1T3IXpgCUtTzqSsXE57eaaTo3vq`
            };
            chai.request(server)
                .put(`/api/v1/posts/${testPostId}`)
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
        it('should delete a SINGLE post on /api/v1/posts/<postId> DELETE', (done) => {
            chai.request(server)
                .delete(`/api/v1/posts/${testPostId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(true);
                    res.body.message.should.equal(1);
                    done();
                });
        });
    });
});
