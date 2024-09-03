const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Определяем Swagger-документацию
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Phone Directory API',
    version: '1.0.0',
    description: 'API for phone directory',
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['app.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let phoneDirectory = [];

// Получение всех записей
app.get('/TS', (req, res) => {
  res.json(phoneDirectory);
});

// Добавление новой записи
app.post('/TS', (req, res) => {
  const newPhoneEntry = req.body;
  const isDuplicate = phoneDirectory.some(
      (entry) => entry.name.toLowerCase() === newPhoneEntry.name.toLowerCase()
  );

  if (isDuplicate) {
    res.status(409).json({
      error: `name '${newPhoneEntry.name}' exists.`,
    });
  } else{
      phoneDirectory.push(newPhoneEntry);
      res.status(201).json(newPhoneEntry);
    }
});

// Обновление существующей записи
app.put('/TS/:name', (req, res) => {
  const name = req.params.name;
  const updatedEntry = req.body;
  const isDuplicate = phoneDirectory.some(
      (entry) => entry.name.toLowerCase() === updatedEntry.name.toLowerCase()
  );
  if (isDuplicate) {
    res.status(409).json({
      error: `name '${name}' exists.`,
    });
  } else{
    let found = false;
    phoneDirectory = phoneDirectory.map((entry) => {
      if (entry.name === name) {
        found = true;
        return updatedEntry;
      }
      return entry;
    });

    if (found) {
      res.json(updatedEntry);
    } else {
      res.status(404).json({ error: "Entry not found" });
    }
  }

});

// Удаление записи
app.delete('/TS/:name', (req, res) => {
  const name = req.params.name;

  const initialLength = phoneDirectory.length;
  phoneDirectory = phoneDirectory.filter((entry) => entry.name !== name);

  if (phoneDirectory.length < initialLength) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Entry not found" });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});


/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneEntry:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the contact
 *         phone:
 *           type: string
 *           description: Phone number
 */

/**
 * @swagger
 * /TS:
 *   get:
 *     summary: Get all phone entries
 *     responses:
 *       200:
 *         description: List of phone entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PhoneEntry'
 */

/**
 * @swagger
 * /TS:
 *   post:
 *     summary: Add a new phone entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneEntry'
 *     responses:
 *       201:
 *         description: Phone entry created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhoneEntry'
 *       409:
 *         description: Conflict - Duplicate name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: A phone entry with the same name already exists.
 */


/**
 * @swagger
 * /TS/{name}:
 *   put:
 *     summary: Update a phone entry
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneEntry'
 *     responses:
 *       200:
 *         description: Phone entry updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhoneEntry'
 *       404:
 *         description: Entry not found
 *       409:
 *         description: Conflict - Duplicate name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: A phone entry with the same name already exists.
 */


/**
 * @swagger
 * /TS/{name}:
 *   delete:
 *     summary: Delete a phone entry
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Entry deleted
 *       404:
 *         description: Entry not found
 */
