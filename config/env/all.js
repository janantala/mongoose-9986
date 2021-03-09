'use strict';

module.exports = {
    app: {
        title: process.env.APP_TITLE || 'app',
        description: '',
        keywords: ''
    },
    db: process.env.MONGODB_URL,
    port: process.env.PORT || 3000
};
