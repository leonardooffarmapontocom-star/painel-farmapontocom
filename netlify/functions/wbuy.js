const https = require('https');

const WBUY_USER = '4de25515-0fb3-4aaf-aa15-9bddc82dce8a';
const WBUY_PASS = '736799574eff40c1a02cebc4d7cc4e2c';
const BASIC_AUTH = 'Basic ' + Buffer.from(`${WBUY_USER}:${WBUY_PASS}`).toString('base64');

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const path = params.path || '/order';
  const query = params.query || '';
  const url = `https://sistema.sistemawbuy.com.br/api/v1${path}${query ? '?' + query : ''}`;

  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'Authorization': BASIC_AUTH,
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: data
        });
      });
    });
    req.on('error', (err) => {
      resolve({ statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: err.message }) });
    });
    req.end();
  });
};
