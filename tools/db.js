/* eslint-disable */
const bcrypt = require('bcrypt-nodejs');
const program = require('commander');
const schemas = require('../models/schemas');
const mongo = require('../lib/mongodb');

const log = console.log;

function connect() {
  return mongo.getReady.catch(() => {
    log('Exiting - Failed to connect to db');
    process.exit(1);
  });
}

async function run(command) {
  try {
    await commands[command]();
  } catch (err) {
    log(`error: ${err.message}`);
    process.exit(1);
  }
}

function done() {
  log('Done!');
  process.exit();
}

const commands = {
  async clean() {
    const db = (await connect()).db;
    log('Deleting DB...');
    return db.dropDatabase();
  },

  async init() {
    const db = (await connect()).db;
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

  async users() {
    function getCollection(db, name) {
      return new Promise((resolve, reject) => {
        db.collection(name, { strict: true }, (err, collection) => {
          if (err) reject(err);
          resolve(collection);
        });
      });
    }

    async function createUser(type) {
      log(` ${type}`);

      const isExist = await users.find({ email: type }, { limit: 1 }).count({ limit: true });
      if (!isExist)
        await users.insertOne({
          username: type,
          email: `${type}@example.com`,
          password: bcrypt.hashSync(type),
          role: type,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      else
        log('User already exists. Skipping');
    }

    const db = (await connect()).db;
    log('Creating users...');

    const users = await
    getCollection(db, 'users');
    await
    createUser('admin');
    await
    createUser('moderator');
    await
    createUser('user');
  },

  async all() {
    await commands.clean();
    await commands.init();
    await commands.users();
  }
};

// Command line options
program
  .command('clean')
  .description('delete all data and DB')
  .action(() => { run('clean').then(done) });

program
  .command('init')
  .description('create collections with their schema')
  .action(() => { run('init').then(done) });

program
  .command('users')
  .description('create sample users in different roles')
  .action(() => { run('users').then(done) });

program
  .command('all')
  .description('clean, init and create sample users')
  .action(() => { run('all').then(done) });

program
  .parse(process.argv);

// Display help whe no input
if (process.argv.length <= 2) program.help();
