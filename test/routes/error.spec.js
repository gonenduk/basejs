const assert = require('assert').strict;
const request = require('supertest');
const express = require('express');
const Boom = require('@hapi/boom');
const sinon = require('sinon');
const logger = require('../../lib/logger');
const errorRouter = require('../../routes/error');

const app = express();

app.use(express.json());
app.use('/api', (req, res, next) => {
  req.api = true;
  next();
});
app.use('/web', (req, res, next) => {
  res.render = () => res.send('text');
  next();
});
app.use((req, res, next) => {
  next(Boom[req.body.type]('message'));
});
app.use(errorRouter);

describe('Error router', () => {
  let loggerStub;

  before(() => {
    loggerStub = sinon.stub(logger, 'error');
  });

  after(() => {
    sinon.restore();
  });

  it('should give status 500 if not given', (done) => {
    request(app)
      .post('/api')
      .expect(500, done);
  });

  it('should not change status if given', (done) => {
    request(app)
      .post('/api')
      .send({ type: 'notFound' })
      .expect(404, done);
  });

  it('should return text when not an api call', (done) => {
    request(app)
      .post('/api')
      .send({ type: 'notFound' })
      .expect(404, done);
  });

  it('should not change status if given', (done) => {
    request(app)
      .post('/web')
      .send({ type: 'notFound' })
      .expect(404, 'text', done);
  });

  it('should only log stack once on server error', () => {
    assert(loggerStub.calledOnce);
  });
});
