const bcrypt = require('bcrypt-nodejs');
const schemas = require('../models/schemas');
const mongo = require('../lib/mongodb');

const log = console.log;
const userCommands = process.argv.slice(2);

function isUserCommandsValid() {
  return userCommands.length && userCommands.reduce((result, command) => result && (command in commands), true);
}

function getCollection(db, name) {
  return new Promise((resolve, reject) => {
    db.collection(name, { strict: true }, (err, collection) => {
      if (err) reject(err);
      resolve(collection);
    });
  });
}

const commands = {
  async init(db) {
    log('Creating collections with their schema and indexes...');

    // Create collections and update latest schema
    for (let collectionName of Object.keys(schemas)) {
      log(` ${collectionName}`);
      await db.createCollection(collectionName);
      await db.command({ collMod: collectionName, validator: schemas[collectionName].schema });
      for (let index of schemas[collectionName].indexes ) {
        await db.createIndex(collectionName, index.fields, index.options);
      }
    }
  },

  clean(db) {
    log('Deleting DB...');
    return db.dropDatabase();
  },

  async users(db) {
    async function createUser(type) {
      log(`${type}`);

      const isExist = await users.find({ email: type }, { limit: 1 }).count({ limit: true });
      if (!isExist)
        await users.insertOne({
          email: type,
          password: bcrypt.hashSync(type),
          role: type,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      else
        log('User already exists. Skipping');
    }

    log('Creating users...');
    const users = await getCollection(db, 'users');
    await createUser('admin');
    await createUser('moderator');
    await createUser('user');
  }
};

// On DB connection
mongo.getReady.then(async connection => {
  for (let i = 0; i < userCommands.length; i++) {
    try {
      await commands[userCommands[i]](connection.db);
      log('OK');
    } catch (err) {
      log(`Command '${userCommands[i]}' failed: ${err.message}`);
      process.exit(1);
    }
  }

  log('Done');
  process.exit();
}).catch(() => {
  log('Exiting - Failed to connect to db');
  process.exit(1);
});

// Validate user commands and print usage on error
if (!isUserCommandsValid()) {
  log('\nInitialize the DB with collections and create schemas.');
  log('\nUsage: node tools/db [command] [command] ...');
  log('\nCommands:');
  log('\tinit\tcreate collections with their schema');
  log('\tclean\tdelete all data and DB');
  log('\tusers\tcreate sample users in different roles');
  process.exit();
}
