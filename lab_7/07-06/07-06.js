const http = require('http');
const fs = require('fs');

const serverUrl = 'http://localhost:5000/';

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data; boundary=boundary',
    },
};

const req = http.request(serverUrl, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response:', data);
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
});

const boundary = 'boundary';
const fileContent = fs.readFileSync('./MyFile.png');

const formData = Buffer.concat([
    Buffer.from(`--${boundary}\r\n`, 'utf-8'),
    Buffer.from('Content-Disposition: form-data; name="file"; filename="MyFile.png"\r\n', 'utf-8'),
    Buffer.from('Content-Type: image/png\r\n\r\n', 'utf-8'),
    fileContent,
    Buffer.from('\r\n', 'utf-8'),
    Buffer.from(`--${boundary}--\r\n`, 'utf-8'),
]);

req.write(formData);
req.end();
