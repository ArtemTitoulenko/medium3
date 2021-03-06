var express = require('express')
var fs = require('fs')

var db = require('./db')

module.exports = function (parent, opts) {
  fs.readdirSync(__dirname + '/../app/controllers').forEach(function (name) {
    opts.verbose && console.log('loading controller:', name)
    var app = express()
    var controllerCtor = require(__dirname + '/../app/controllers/' + name)
    var controller = new controllerCtor(db)

    console.log(controller.db)

    var routes = controllerCtor.ROUTES || controller.routes
    if (!routes) throw new Error(controllerCtor.name + ' has no routes defined')

    // set the views for the controller to be inside of the controller's folder
    app.set('views', __dirname + '/../app/controllers/' + name + '/views')

    // set the routes that the controller exposes
    routes.map(function (route) {
      console.log(route)
      app[route.method](route.path, controller[route.action])
    })

    // attach this controller to the main server app
    parent.use(app)
  })
}
