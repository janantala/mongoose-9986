'use strict';

module.exports = {
    db: process.env.MONGODB_URL,
    port: process.env.PORT || 3001,
    app: {
        title: 'app-test'
    }
};
