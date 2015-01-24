OneStack Enterprise Service Platform
====================================

[![Build Status](https://img.shields.io/travis/e2tox/OneStack.svg?style=flat)](https://travis-ci.org/e2tox/OneStack)
[![Coverage Status](https://img.shields.io/coveralls/e2tox/openstack/master.svg?style=flat)](https://coveralls.io/r/e2tox/openstack?branch=master)

OneStack is an platform for developing enterprise applications.

## Technologies
nodejs/iojs, JavaScript, YAML, JSON

## Prerequisites
```
$ sudo npm install -g grunt-cli
```

## Quick Install
```
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application.

## Before Development
After the installation process is over, you'll be able to run tests using Grunt, just run grunt default task:

```
$ grunt
```

You should view the test result from the console

## Running Test with Coverage

```
$ grunt coverage
```

You should view the test coverage from `test/coverage.html`

## Versions

#### 1.0.0
Integrate Hapi with swagger interface

