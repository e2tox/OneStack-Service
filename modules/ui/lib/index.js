var path = require('path');
var Hoek = require('hoek');
var _ = require('lodash');
var swaggerUiPath = path.join(__dirname, '../dist');
var Joi = require('joi');

var optionsSchema = Joi.object({
    title: Joi.string().required(),
    swaggerEndpoint: Joi.string().optional(),
    swaggerOptions: Joi.object({
        supportedSubmitMethods: Joi.array().items(Joi.string()).optional(),
        sorter: Joi.string().valid(['none', 'alpha', 'method']).optional(),
        docExpansion: Joi.string().valid(['none', 'list', 'full']).optional(),
        validatorUrl: Joi.string().optional()
    }).optional(),
    oauthOptions: Joi.any({}),
    authorization: Joi.object({
        field: Joi.string().required(),
        scope: Joi.string().valid(['query', 'header']).required(),
        valuePrefix: Joi.string().optional(),
        defaultValue: Joi.string().optional(),
        placeholder: Joi.string().optional()
    }).optional()
});

var defaultOptions = {
    title: 'swagger',
    swaggerOptions: {
        supportedSubmitMethods: ['get', 'post', 'put', 'patch', 'delete'],
        sorter: 'alpha',
        docExpansion: 'none'
    }
};

var register = function (plugin, options, next) {
    var settings = Hoek.applyToDefaults(defaultOptions, options || {});
    Joi.assert(settings, optionsSchema, 'Invalid options for onestack-service-spec');

    var routeModifiers = plugin.config || Hoek.reach(plugin, 'realm.modifiers');
    var routePrefix = Hoek.reach(routeModifiers, 'route.prefix');

    var internals = {
        handler: function (request, reply) {

            var hapiSwaggeredSettings = Hoek.reach(plugin, 'plugins.onestack-service-spec.settings');
            var swaggerEndpoint = null;

            if (settings.swaggerEndpoint) {
                swaggerEndpoint = options.swaggerEndpoint;
            } else if (hapiSwaggeredSettings && hapiSwaggeredSettings.endpoint) {
                swaggerEndpoint = (hapiSwaggeredSettings.pluginRoutePrefix || '') + hapiSwaggeredSettings.endpoint;
            }

            var context = {
                routePrefix: routePrefix,
                title: settings.title,
                authorization: settings.authorization
            };

            if (swaggerEndpoint) {
                var swaggerOptions = {
                    url: swaggerEndpoint,
                    validatorUrl: null
                };

                var tags = null;

                if (request.query.tags) {
                    tags = request.query.tags;
                } if (settings.defaultTags) {
                    tags = _.isArray(settings.defaultTags) ? settings.defaultTags.join(',') : settings.defaultTags;
                }

                if (tags) {
                    swaggerOptions.url = swaggerEndpoint + '?tags=' + encodeURIComponent(tags);
                }

                _.extend(swaggerOptions, settings.swaggerOptions);

                context.swaggerOptions = JSON.stringify(swaggerOptions);
                context.oauthOptions = JSON.stringify(settings.oauthOptions || false);
                return reply.view('index', context);
            } else {
                return reply.view('error', context);
            }
        }
    };

    plugin.views({
        engines: {
            hbs: {
                module: require('handlebars')
            }
        },
        path: path.join(__dirname, '../templates')
    });

    //plugin.route({
    //    method: 'GET',
    //    path: '/',
    //    config: {
    //        handler: internals.handler
    //    }
    //});

    plugin.route({
        method: 'GET',
        path: '/index.html',
        config: {
            handler: internals.handler
        }
    });

    plugin.route({
        method: 'GET',
        path: '/{path*}',
        config: {
            handler: {
                directory: {
                    path: [
                        path.join(__dirname, '../public'),
                        swaggerUiPath
                    ],
                    index: true,
                    listing: false
                }
            }
        }
    });

    next();
};

exports.register = function (server, options, next) {

    var hapi8 = /^8\./.test(server.version)

    if (hapi8 || options.skipDependencies === true) {
        return register(server, options, next)
    }

    server.dependency(['vision', 'inert'], function (server, next) {
        register(server, options, next)
    })

    return next();

};

exports.register.attributes = {
    pkg: require('../package.json')
};
