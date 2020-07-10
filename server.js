const express = require('express');
const actionRouter = require('./data/helpers/actionRouter')
const projectRouter = require('./data/helpers/projectRouter')

const server = express();

server.use(express.json());

server.use('/api/actions', actionRouter)
server.use('/api/projects', projectRouter)

server.get('/', (req, res) => {
  res.status(200).send(`<h1>node api challenge</h1>`);
});

module.exports = server;
