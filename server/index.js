/* eslint-disable no-underscore-dangle */
// const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
// const passport = require('passport');
// const FacebookStrategy = require('passport-facebook').Strategy;
const routers = require('./routes');
const {
    app: serverConfig, database, session: sessionConfig,
    // facebook
} = require('./config');
const logger = require('./utils/logger');

mongoose.promise = global.Promise;

const isProduction = serverConfig.env === 'production';

const app = express();

// // Passport session setup.
// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//     done(null, obj);
// });

// // define passport facebook
// passport.use(new FacebookStrategy({
//     clientID: facebook.key,
//     clientSecret: facebook.secret,
//     callbackURL: facebook.callbackUrl
// },
// ((accessToken, refreshToken, profile, done) => {
//     process.nextTick(() => {
//         // Check whether the User exists or not using profile.id
//         if (facebook.useDatabase) {
//             // Further code of Database.
//         }
//         return done(null, profile);
//     });
// })));

app.use(cors());
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: sessionConfig.secret, cookie: { maxAge: sessionConfig.maxAge }, resave: false, saveUninitialized: false
}));

if (!isProduction) {
    app.use(errorHandler());
}

const connectWithRetry = () => {
    mongoose.connect(
        // eslint-disable-next-line max-len
        `mongodb://${database.dbHost}:${database.dbPort}/${database.dbName}`,
        {
            user: serverConfig.env === 'production ' ? database.dbUsername : '',
            pass: serverConfig.env === 'production ' ? database.dbPassword : '',
            useNewUrlParser: true,
            reconnectTries: 10,
            reconnectInterval: 500,
            poolSize: 10,
            bufferMaxEntries: 0
        }
    ).then(() => {
        logger.trace('MongoDB is connected');
    }).catch((err) => {
        logger.error(err);
        logger.trace('MongoDB connection unsuccessful, retry after 5 seconds.');
        setTimeout(connectWithRetry, 5000);
    });
};

mongoose.set('debug', true);

// Add routes
app.use(routers);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (!isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

/**
 * List all registed route
 */
const listRoutes = () => {
    const results = [];
    const split = (thing) => {
        if (typeof thing === 'string') {
            return thing.split('/');
        } if (thing.fast_slash) {
            return '';
        }
        const match = thing.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
        return match
            ? match[1].replace(/\\(.)/g, '$1').split('/')
            : `<complex:${thing.toString()}>`;
    };
    const print = (path, layer) => {
        if (layer.route) {
            layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
        } else if (layer.name === 'router' && layer.handle.stack) {
            layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
        } else if (layer.method) {
            results.push([layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join('/')]);
        }
    };
    app._router.stack.forEach(print.bind(null, []));
    return results;
};

// eslint-disable-next-line no-console
console.table(listRoutes());

app.listen(serverConfig.port, () => {
    connectWithRetry();
    // listAllRoutes();
    return logger.trace(`Server started on http://localhost:${serverConfig.port}`);
});

module.exports = app;
