# basejs

My own personal taste server implementation with
a list of features I use in most of the cases.
Instead of developing a server from scratch each project, I start
with this one and develop on top of it.

A running server with the latest code can be found here:

[https://basejs.herokuapp.com](https://basejs.herokuapp.com)  

## Contribution

Any help would be appreciated!

Feel free to fork, copy, suggest, report issues and create pull requests.

## Quick Start

basejs is not a package nor a generator. It's a complete project.
Once you clone it, you can edit the configuration files,
delete the features you don't require and add your own logic on top of it.
```sh
$ git clone https://www.github.com/gonenduk/basejs
$ cd basejs
$ npm install
$ npm run db clean init admin
$ npm start
```

## Project Structure

```
root
  |--config
  |--handlers
  |    |--plugins
  |--lib
  |--models
  |    |--plugins  
  |    |--schemas  
  |--public
  |--routes
  |--tools
  |--views
  |    |--emails   
```
**root**: Main server and app files.

**config**: Configuration files.

**handlers**: Handlers of routes both for API calls and web pages.
The actual business logic of end points.

**handlers plugins**: Common base handlers to be used by other handlers.
For example, handling collections and items of resources, updating ownership...

**lib**: Wrappers around 3rd party packages to initialize and isolate them.
Allows required behavior and replacing of packages without changing project code.

**models**: Models of resources. Does not have to have a DB collection associated with it.

**models plugins**: Common base models to be used by other models.
For example, handling collections and items, ownership, timestamps...

**models schemas**: Schema and index definitions of each DB model.   

**public**: Public static files

**routes**: Automatic routes builder and input verification according to OpenAPI standard.
The OpenAPI definition file is located here. 

**tools**: Project tools. For example, initializing the DB schemas and indexes
and creating system users. 

**views**: Templates of web pages.

**views emails**: Templates of emails.

## Features

### Express

Project was build on top of [express](https://www.npmjs.com/package/express)
which is the most popular framework for Node.js.

### Configuration

Configuration files are located under the config directory.
Key features:
* configuration per node environment.
* environment variables override for secrets support.
* local configuration for testing while developing (not uploaded to git).


More info about configuration in [config](https://www.npmjs.com/package/config)
 
### Logger

Using [winston](https://www.npmjs.com/package/winston) logger.

Can be configured under 'log':
* level: log level
* console: true to log to the console
* file: file name to log to or empty to disable file logs

Both console and file can be enabled together.

HTTP requests are logged using [morgan](https://www.npmjs.com/package/morgan)
and can be configured under 'morgan'.

### Protocols

What protocols and ports to listen to. Can be configured under server.ports:
* http: port to listen to or false not to use
* https: port to listen to or false not to use

The list is dynamic so any other protocol which is supported by Node.js can be added to the list.

In some managed servers environments, like [heroku](https://heroku.com) or [aws](https://aws.amazon.com),
only http is used and the port is set in an environment variable. Should be set in
custom-environment-variables.json file to overwrite the port.

To breakdown and log outgoing network operations, enable the relevant protocol under log:
* http: true to enable breakdown logs for outgoing http calls
* https: true to enable breakdown logs for outgoing https calls

### Clustering

Can be configured under 'server':
* workers: number of workers to fork. 0 (default) to not use clustering,
auto to fork by cpu count. 

When using clustering, logger will automatically add worker id to each log message.

Some managed servers, like [heroku](https://heroku.com), set an enviroment variable with
the optimum amount of workers to use, calculated by cpu count and available memory.
Can be configured in custom-environment-variables.json config file to overwrite the configuration
to get optimum performance.

Clustering using [throng](https://www.npmjs.com/package/throng)

### OpenAPI driven development

API routes are built and exposed in runtime according to the provided OpenAPI definition file.
Input is verified and errors are sent back to clients on invalid data.
Handlers are the last part of the routes chain and they are called only after validation and
authentication have passed successfully. Handlers is where the actual business logic of the route
is done.

Can be configured under 'api':
* docs: true to expose a route with the OpenAPI definition
* ui: true to expose a route with the swagger ui tool
* mock: true to use a mock instead of teh handlers

Building routes using [swagger-express-middleware](https://www.npmjs.com/package/swagger-express-middleware)

OpenAPI definition file can be built using [Swagger Tools](https://swagger.io/)

### Database management

All operations that require DB are done by models. Models usually represent a collection but don't
have to. Models expose operations in their interface thus allowing to replace a DB vendor and
keeping the code of the server unchanged.
   
Each DB vendor should have a wrapping lib which exposes a unified interface to connect and exchange
data with the DB driver. Using the lib is limited to models and tools. This allows the option to
replace DB vendors easily.

Support for [MongoDB](https://www.npmjs.com/package/mongodb)
and [Redis](https://www.npmjs.com/package/redis)

### Authentication and authorization

Using JWT to authenticate and authorize users. All calls to the server must contain the token
or will be considered as a guest. Secrets and TTL can be configured under server.JWT:
* secret: secret to use to sign and verify the token
* accessTTL: life time of access token, default 1 hour
* refreshTTL: life time of refresh token, default to 1 week

Authentication can be done by:
* user credentials
* refresh token
* social login: facebook, google, github and windows

Once authenticated the user will get its user id and user role for access control.
To log out a user from a device, clients need just to delete the token they got and not use it anymore.
A change of password, or calling the logout API will log out the user from all devices: Existing refresh
tokens will be expired. Existing access tokens will continue to work even after logout.

### User and profile management

User is the identity of a real person. It usually contains credentials, tokens, contact details,
billing info and such. Profile is the how the user is seen to other users in the system.
The profile contains a virtual sub set of the user information.

Users have roles. Each role defines a set of permissions and restrictions. By default the
following roles are defined and can be easily changed:
* guest: unidentified user, can register as a new user and view any resource. 
* user: can update its own account and resources and view any resource.
* moderator: same as user + can view any account.
* admin: same as moderator + can update any account and resource.     

Only admin can change user role.

Access control is done using [accesscontrol](https://www.npmjs.com/package/accesscontrol)

### Resource management

Most collections and models, except system data and users will be resources owned by users.
Resource logic is easily made from several plugins and may have its own extra logic.
Plugins can be done in model level, like the timestamp plugin on, or in API level like the ownership
plugin that limits each user to manage its own resources.
All resources share teh same access control rules by default, but each can be overwritten.

### Google Analytics

Page views and API calls can be reported to Google analytics.
For web page views, both server side and client side reports are supported.


Configuration under 'analytics':
* ua: universal analytics id  
* api: true to enable server side API calls reports.
* web: true to enable server side web page views reports.
* client: report from client side.


Server side reports using [universal-analytics](https://www.npmjs.com/package/universal-analytics) 

### Email delivery and templates

### Extras

Checksum calculation and validation and generating uuid.

## Planned Features

### ESLint
### Unit Testing & Coverage
### Using Travis

## License

[ISC](LICENSE)
