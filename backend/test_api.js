const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

const form = new FormData();
form.append('resume', fs.createReadStream('Yash_Resume_AI_projects.pdf'));

const request = http.request({
  method: 'POST',
  host: 'localhost',
  port: 3000,
  path: '/api/resume/upload',
  headers: form.getHeaders()
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

form.pipe(request);
