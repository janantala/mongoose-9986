'use strict';

var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var path = require('path');


var lintFiles = ['*.js', 'app/**/*.js', 'config/*.js', 'config/**/*.js'];
var testFiles = ['app/tests/*.js', 'app/tests/**/*.js'];

var handleError = function(err) {
    console.error(err);
    this.emit('end');
};

gulp.task('lint', function () {
    console.log('Linting Files');
    return gulp.src(lintFiles)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('waitForMongo', async function() {

    process.env.MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019?replicaSet=rs';
    var hosts = process.env.MONGODB_URL.split('//')[1].split('?')[0].split('/')[0].split(',');

    var resources = hosts.map(function(host){
        return 'tcp:' + host;
    });

    console.log('waitForMongo', resources);

    var waitOn = require('wait-on');

    var opts = {
        resources: resources,
        delay: 1000, // initial delay in ms, default 0
        interval: 100, // poll interval in ms, default 250ms
        timeout: 5 * 60 * 1000, // timeout in ms, default Infinity
        tcpTimeout: 1000, // tcp timeout in ms, default 300ms
        window: 1000, // stabilization time in ms, default 750ms

        // http options
        strictSSL: false,
        followRedirect: true
    };

    console.log('Waiting for mongo');

    try {
        // once here, all mongodb resources are available
        await waitOn(opts);
        // wait for primary node selection in replicaset
        await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (err) {
        handleError(err);
    }
});

gulp.task('mocha', function () {
    process.env.NODE_ENV = 'test';

    return gulp.src(testFiles, {read: false})
        .pipe(mocha({
            reporter: 'spec',
            timeout: 10000,
            exit: true
        }));
});

gulp.task('default', gulp.series('lint', 'waitForMongo', 'mocha'));
