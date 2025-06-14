const express = require('express');
const app = require('./src/app');
const config = require('./src/config/env');

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});