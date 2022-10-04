const bcrypt = require('bcryptjs');
const program = require('commander');
const schemas = require('../models/schemas');
const mongo = require('../lib/mongodb');

const { log } = console;
const { ObjectId } = mongo.driver;

Promise.each = async (arr, fn) => {
  // eslint-disable-next-line no-restricted-syntax,no-await-in-loop
  for (const item of arr) await fn(item);
};

async function connect() {
  if (!mongo.isConnected) await mongo.connect();
  return mongo.db;
}

const commands = {
  async clean() {
    const db = await connect();
    log('Deleting DB...');
    return db.dropDatabase();
  },

  async init() {
    const db = await connect();
    log('Creating collections with their schema and indexes...');

    // Create collections and update schema
    return Promise.each(Object.keys(schemas), async (collectionName) => {
      log(` ${collectionName}`);
      await db.createCollection(collectionName);
      await db.command({ collMod: collectionName, validator: schemas[collectionName].schema });
      return Promise.each(schemas[collectionName].indexes, async (index) => {
        await db.createIndex(collectionName, index.fields, index.options);
      });
    });
  },

  async users() {
    const db = await connect();
    log('Creating users...');

    const users = db.collection('users');

    async function createUser(type) {
      log(` ${type}`);

      const isExist = await users.countDocuments({ username: type }, { limit: 1 });
      if (!isExist) {
        await users.insertOne({
          username: type,
          email: `${type}@example.com`,
          password: bcrypt.hashSync(type),
          role: type,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        log('User already exists. Skipping');
      }
    }

    await createUser('admin');
    await createUser('moderator');
    await createUser('user');
  },

  async products() {
    const db = await connect();
    log('Creating products...');

    const products = db.collection('products');

    async function createProduct(title, price) {
      log(` ${title}`);

      const isExist = await products.countDocuments({ title }, { limit: 1 });
      if (!isExist) {
        await products.insertOne({
          title,
          price,
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: new ObjectId('6335515d0245a17258f96c69'),
        });
      } else {
        log('Product already exists. Skipping');
      }
    }

    await createProduct('table', 10);
    await createProduct('chair', 5);
    await createProduct('picture', 2);
    await createProduct('carpet', 3);
    await createProduct('closet', 20);
  },

  async tickets() {
    const db = await connect();
    log('Creating tickets...');

    const tickets = db.collection('tickets');

    async function createTicket(title, venue, price) {
      log(` ${title}`);

      const isExist = await tickets.countDocuments({ title }, { limit: 1 });
      if (!isExist) {
        await tickets.insertOne({
          title,
          venue,
          price,
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: new ObjectId('6335515d0245a17258f96c69'),
        });
      } else {
        log('Ticket already exists. Skipping');
      }
    }

    await createTicket('ofra', 'expo', 300);
    await createTicket('forever', 'haoman', 200);
    await createTicket('luly', 'zizi', 80);
  },

  async all() {
    await commands.clean();
    await commands.init();
    await commands.users();
    await commands.products();
    await commands.tickets();
  },
};

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

// Command line options
program
  .command('clean')
  .description('delete all data and DB')
  .action(() => { run('clean').then(done); });

program
  .command('init')
  .description('create collections with their schema')
  .action(() => { run('init').then(done); });

program
  .command('users')
  .description('create sample users in different roles')
  .action(() => { run('users').then(done); });

program
  .command('products')
  .description('create sample products')
  .action(() => { run('products').then(done); });

program
  .command('tickets')
  .description('create sample tickets')
  .action(() => { run('tickets').then(done); });

program
  .command('all')
  .description('clean, init and create sample users and products')
  .action(() => { run('all').then(done); });

program
  .parse(process.argv);

// Display help whe no input
if (process.argv.length <= 2) program.help();
