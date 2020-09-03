/* eslint-disable */
// Environment Variables From .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

let server;

// Exit Error Handler
function exitHandler() {
  if (server) {
    console.log('here');
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

// Unexpected Error Handler
function unexpectedErrorHandler(error) {
  console.log('Unexpected Error 💥');
  console.error(error);
  exitHandler();
}

// on error events
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Requires
const app = require('./app');
const mongoose = require('mongoose');

// Connect Database
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to Database!'));

// Start Server
server = app.listen(process.env.PORT || 3000, () => {
  if (!process.env.PORT) {
    console.log('Server is listening on http://localhost:3000');
  } else {
    console.log(`Server is listening on port ${process.env.PORT}`);
  }
});

// Close the server when recieved a SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
