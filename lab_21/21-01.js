import express from "express";
import bodyParser from "body-parser";
import * as fs from "fs";
import { createClient } from 'webdav';
const app = express();
const client = createClient(
    'https://webdav.yandex.ru',
    {
    username: 'webdavlab20@yandex.ru',
    password: 'xpiljiqvjgyskeyd'
    }
);
const filePath = './';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.method, decodeURI(req.url));
    next();
});
app.post('/md/:path', async (req, res) => {
    const path = '/' + req.params.path;
    try {
        console.log(path);
        if (await client.exists(path)) {
            res.status(408).send('Already exists');
        }
        else {
            await client.createDirectory(path);
            res.status(200).send('OK');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
app.post('/rd/:path', async (req, res) => {
    const path = '/' + req.params.path;
    try {
        if (await client.exists(path)) {
            await client.deleteFile(path);
            res.status(200).send('OK');
        }
        else {
            res.status(404).send('Not found');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.post('/up/:name', async (req, res) => {
    const file = filePath + req.params.name;
    try {
        if (await client.exists(file)) {
            await client.deleteFile(file);
        }
        const readStream = fs.createReadStream(file);
        if (await client.putFileContents(req.params.name, readStream)) {
            res.status(200).send('OK');
        }
        else {
            res.status(408).send('Not accepted');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.post('/down/:name', async (req, res) => {
    const file = '/' + req.params.name;
    try {
        if (await client.exists(file)) {
            const readStream = client.createReadStream(file);
            const writeStream = fs.createWriteStream(filePath + file);
            readStream.pipe(writeStream);
            res.status(200).send('OK');
        }
        else {
            res.status(404).send('Not found');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.post('/del/:name', async (req, res) => {
    const file = '/' + req.params.name;
    try {
        if (await client.exists(file)) {
            await client.deleteFile(file);
            res.status(200).send('OK');
        }
        else {
            res.status(404).send('Not found');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.post('/copy/:source/:destination', async (req, res) => {
    const sourcePath = '/' + req.params.source;
    const destinationPath = '/' + req.params.destination;
    try {
        if (await client.exists(sourcePath)) {
            await client.copyFile(sourcePath, destinationPath);
            res.status(200).send('OK');
        }
        else {
            res.status(404).send('Not found');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.post('/move/:source/:destination', async (req, res) => {
    const sourcePath = '/' + req.params.source;
    const destinationPath = '/' + req.params.destination;
    try {
        if (await client.exists(sourcePath)) {
            await client.moveFile(sourcePath, destinationPath);
            res.status(200).send('OK');
        }
        else {
            res.status(404).send('Not found');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.listen(3000, () => {
    console.log("ok");
});
