import axios from 'axios';

export async function initializeReplicas(replicas, code) {
    for (const replica of replicas) {
        await axios.post(`${replica}/init`, { code });
    }
}

export async function executeTask(replicas, task) {
    console.log(`Task recieved for scheduling : ${task}`);
    const replica = replicas[Math.floor(Math.random() * replicas.length)];
    console.log(`Task recieved for scheduling : ${task} on replicas: ${replica}`);
    const response = await axios.post(`${replica}/execute`, { task });
    const {wordCount, charCount} = response.data
    console.log(`Response from init execute: ${wordCount} - ${charCount}`);
    // return {wordCount, charCount};
    return {wordCount, charCount};
}
