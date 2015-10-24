
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