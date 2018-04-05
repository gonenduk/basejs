const schemas = require('../models/schemas');
require('../lib/mongodb').then(dbConnected);

const log = console.log;
const userCommands = process.argv.slice(2);

function isUserCommandsValid() {
  return userCommands.length && userCommands.reduce((result, command) => result && (command in commands), true);
}

async function dbConnected(db) {
  if (!db) {
    log('Exiting - Failed to connect to db');
    process.exit(1);
  }

  for (let i = 0; i < userCommands.length; i++) {
    try {
      await commands[userCommands[i]](db);
      log('OK');
    } catch (err) {
      log(`${userCommands[i]} failed: ${err.message}`);
      process.exit(1);
    }
  }

  log('Done');
  process.exit(0);
}

const commands = {
  async init(db) {
    log('Creating collections with their schemas...');

    // Create collections and update latest schema
    for (let collectionName in schemas) {
      log(` ${collectionName}`);
      await db.createCollection(collectionName);
      await db.command({ collMod: collectionName, validator: schemas[collectionName] });
    }
  },

  clean(db) {
    log('Deleting DB...');
    return db.dropDatabase();
  }
};

// Validate user commands and print usage on error
if (!isUserCommandsValid()) {
  log('\nInitialize the DB with collections and create schemas.');
  log('\nUsage: node tools/db [command] [command] ...');
  log('\nCommands:');
  log('\tinit\tcreate collections with their schema');
  log('\tclean\tdelete all data and DB');
  process.exit(0);
}
