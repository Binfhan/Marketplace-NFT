require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const reoutes = require('./routes');
const { sequelize } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use (express.urlencoded({ extended: true }));

app.use('/api', reoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}   ).catch((error) => {
  console.error('Unable to connect to the database:', error);
});