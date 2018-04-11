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

### Database management

All operations that require DB are done by models. Models usually represent a collection but don't
have to. Models expose operations in their interface thus allowing to replace a DB vendor and
keeping the code of the server unchanged.
   
Each DB vendor should have a wrapping lib which exposes a unified interface to connect and exchange
data with the DB driver. Using the lib is limited to models and tools. This allows the option to
replace DB vendors easily.

Using [MongoDB driver](https://www.npmjs.com/package/mongodb)

### User management

Allows management of users in the system: Adding new users, updating user info and role,
deleting users and so on. Since user info contains sensitive data, i.e.
password, social networks tokens, contact details, billing info and more, viewing the data
it is limited to the user itself or the system admins. Any information which
should be visible to other users, like profile picture, bio and so on,
should be part of the [profile](#Profile management) and not part of the user data.

There are several user roles: user, moderator, admin, sysadmin. If more types     
are requires, it can be easily done in lib/roles.js file.
* user: can view and edit own account and resources, can view other users resources.
* moderator: same as user + can view all user accounts.
* admin: same as moderator + can edit all accounts, resources and user roles.
* sysadmin: super admin account which cannot be changed to a regular account by other admins.
Should be created during DB initialization. 
  
### Profile management

Profiles are the representation of users in the system to other users. They include
all personal data which can be shared between users, i.e. profile picture, name, bio and so on.

In systems where profiles are being used, all other resources are owned by a profile while profiles
are owned by users. The separation allows:
* More secured. Personal user data is not shared between users.
* Faster. In most cases the profile data is what required and not the account info.
* Profiles can be transferred between accounts.
* Can easily implement a single profile managed by several different users.

Ownership of resources by profiles is managed by plugins:
handlers/plugins/*-ownership.js

ownerId is read only and gets the ownership of the profile who created it automatically by the handlers.
Changing ownership between profiles is restricted to admins but can be changed to allow users
to exchange resources between themselves - but should be kept as a seperate process than
updating the resource ownerId. 

In systems where there is no user representation and profiles are not being used,
all resources can be owned directly by users. Since ownership of resources is done in a
plugin, it can be easily changed from using profileId to userId.
  
### Resource management

Most collections and models, except system data, users and profiles will be resources owned by
profiles. Resource logic is easily made from several plugins and may have its own extra logic.
Plugins can be done in model level, like the timestamp plugin on, or in API level like the ownership
plugin that limits each user to manage its own resources.

Operations on resource collections will automatically be filtered to resources owned by the active user.
This is done for safety reason to block users from making mass updates on the system. Only admins can
update resources of other users. 

### Authentication
### Authorization
### Google Analytics

Page views and API calls can be reported to Google analytics.
For web page views, both server side and client side reports are supported.


Configuration under 'analytics':
* ua: universal analytics id  
* api: true to enable server side API calls reports.
* web: true to enable server side web page views reports.
* client: report from client side.


Server side reports using [universal-analytics](https://www.npmjs.com/package/universal-analytics) 

### Email management and templates
 

## Planned Features

### ESLint
### Unit Testing & Coverage
### Using Travis

## License

[ISC](LICENSE)
