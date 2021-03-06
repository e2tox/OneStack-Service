'use strict';

/**
 * Test Module dependencies..
 */


// Init the configuration module.
var should = require('should');
var onestack = require('onestack');
var Server = require('../index');


describe('Init with error customized settings', function () {
    it('should not able to start server', function () {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/error_loading_controller_service');
            app.start();
            app.stop();
        }).should.throw();
    });
});
