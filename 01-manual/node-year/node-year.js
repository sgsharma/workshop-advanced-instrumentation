'use strict';
const { trace, context } = require('@opentelemetry/api');

const express = require('express');
function doRandomWork(max_wait_time) {
  // mock some work by sleeping
  const wait_time = Math.floor(Math.random() * max_wait_time) + 1;
  return new Promise((resolve, reject) => {
    setTimeout(resolve, wait_time);
  })
}
// Constants
const PORT = 6001;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/year', async (req, res) => {
  const year = await getYear(years);

  res.send(`${year}`);
});

const years = [2015, 2016, 2017, 2018, 2019, 2020];

async function getYear() {
  const tracer = trace.getTracer("node-year.js");
  const span = tracer.startSpan("getYear");

  const rnd = Math.floor(Math.random() * years.length);
  const year = years[rnd];

  span.setAttributes({ 'year': year, 'random-index': rnd });

  await doRandomWork(250);

  span.end();
  return year;
}

app.listen(PORT, HOST);
console.log(`Running node year service on http://${HOST}:${PORT}`);