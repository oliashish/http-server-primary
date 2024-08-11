import express from 'express';
import axios from 'axios';
// import { pkg } from 'body-parser';
import { readFileSync } from 'fs';
import { initializeReplicas, executeTask } from './common/init.js';

// const {json} = pkg

const app = express();
const port = 3000;

app.use(express.json());

const replicas = [
    // 'http://hreplica:3001',
    'http://13.234.17.0:80'
    // 'http://localhost:3001',
    // 'http://localhost:3002'
];

// Read business logic from file
const businessLogic = readFileSync('./ms/businessLogic.js', 'utf8');
const functionBody = businessLogic.substring(businessLogic.indexOf('{') + 1, businessLogic.lastIndexOf('}'));

// Execute task
app.post('/execute', async (req, res) => {
    // TODO - add a tag to the task in the body so that I send it to the correct microservice
    const { task } = req.body;
    console.log(req.body);
    console.log(task);
    const {wordCount, charCount} = await executeTask(replicas, task);
    res.send({wordCount, charCount});
});

// Initialize replicas when the server starts
async function initializeOnStartup() {
    try {
        await initializeReplicas(replicas, functionBody);
        console.log('Business logic distributed to replicas');
    } catch (err) {
        console.error(`Error while distributing code to replicas: ${err}`);
    }
}

app.listen(port, async () => {
    console.log(`Primary microservice running on port ${port}`);
    await initializeOnStartup()
});
