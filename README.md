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
For example, handling collections and items of resources.

**lib**: Wrappers around 3rd party packages to initialize and isolate them.
Allows required behavior and replacing of packages without changing project code.

**models**: Models of resources. Does not have to have a DB collection associated with it.

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
### Protocols
### Clustering
### OpenAPI driven development
### Database management
### Resource management
### Authentication
### Authorization
### User and profile management
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

## License

[ISC](LICENSE)
