const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(process.env.PREFIX_API_VERSION, require(`${__dirname}/../routers/web`));

module.exports = app;