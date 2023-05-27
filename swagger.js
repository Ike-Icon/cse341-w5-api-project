const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Tasks Management System',
    description: 'API documentation for Tasks Management System'
  },
  host: 'localhost:3000',
  schemes: ['https','http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
  await import('./server.js');
});
