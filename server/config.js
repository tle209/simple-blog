module.exports = {
    app: {
        env: process.env.NODE_ENV || 'dev',
        port: process.env.PORT || 8000
    },
    pagination: {
        limit: 10
    },
    database: {
        dbHost: process.env.DATABASE_HOST || '127.0.0.1',
        dbName: process.env.DATABASE_NAME || 'simpleblog_db',
        dbUsername: process.env.DATABASE_USERNAME || 'admin',
        dbPassword: process.env.DATABASE_PASSWORD || 'secret@123',
        dbPort: process.env.DATABASE_PORT || 27017,
    },
    session: {
        secret: 'simpleBlog',
        maxAge: 60000
    },
    facebook: {
        key: '3086073768145315',
        secret: '1c278c5f821bd9fcd6ade3dec9732928',
        callbackUrl: '/auth/facebook/callback',
        useDatabase: true
    }
};
