const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const catalogServers = ['http://localhost:3001', 'http://localhost:3003'];
const orderServers = ['http://localhost:3002', 'http://localhost:3004'];

const cache = new Map();
const invalidationRequests = new Set();

async function isServerAvailable(server) {
    try {
        await axios.get(`${server}/status`); 
        return true;
    } catch (error) {
        console.log(`Server not available: ${server}`);
        return false;
    }
}

async function getNextServer(servers) {
    for (let index = 0; index < servers.length; index++) {
        const server = servers[index];
        console.log(`Checking server: ${server}`);
        if (await isServerAvailable(server)) {
            console.log(`Server available: ${server}`);
            return server;
        }
            
    }
}

function cleancache() {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (value.expiry < now) {
            cache.delete(key);
            console.log(key , "\n is deleted")
        }
    }
}
setInterval(cleancache, 6000);

app.get('/search/:topic', async (req, res) => {
    const topic = req.params.topic;
console.log("###----------------------------------------------------------------###")
console.log(cache)
    if (cache.has(topic)) {
        
        const cachedData = cache.get(topic);
        if (cachedData.expiry > Date.now()) {
            return res.json({ source: 'cache', data: cachedData.data });
        }
    }

    const server = await getNextServer(catalogServers);
    try {
        const response = await axios.get(`${server}/search/${topic}`);
        cache.set(topic, { data: response.data, expiry: Date.now() + 30000 });
        invalidationRequests.delete(topic);
        res.json({ source: server, data: response.data });
    } catch (error) {
        res.status(500).send('Error fetching books by topic');
    }
});

app.get('/info/:item_number', async (req, res) => {
    console.log("###----------------------------------------------------------------###")
console.log(cache)
    const itemNumber = req.params.item_number;

    if (cache.has(itemNumber)) {
        const cachedData = cache.get(itemNumber);
        if (cachedData.expiry > Date.now()) {
            return res.json({ source: 'cache', data: cachedData.data });
        }
    }

    const server = await getNextServer(catalogServers);
    try {
        const response = await axios.get(`${server}/info/${itemNumber}`);
        cache.set(itemNumber, { data: response.data, expiry: Date.now() + 30000 });
        res.json({ source: server, data: response.data });
    } catch (error) {
        res.status(500).send('Error fetching book information');
    }
});

app.post('/purchase/:item_number', async (req, res) => {
    console.log("###----------------------------------------------------------------###")
console.log(cache)
    const itemNumber = req.params.item_number;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send('Invalid purchase amount.');
    }

    const server = await getNextServer(orderServers);
    try {
        const response = await axios.post(`${server}/purchase/${itemNumber}`, { amount });

        cache.delete(itemNumber);

        res.json({
            source: server, 
            message: 'Purchase processed successfully',
            data: response.data
        });
    } catch (error) {
        res.status(500).send('Error processing purchase');
    }
});

app.put('/update', async (req, res) => {
    console.log("###----------------------------------------------------------------###")
console.log(cache)
    const { id, stock, price } = req.body;

    if ((stock === undefined && price === undefined) || (stock < 0 || price < 0)) {
        return res.status(400).send('Invalid update parameters.');
    }

    const server = await getNextServer(catalogServers);
    try {
        const response = await axios.put(`${server}/update`, { id, stock, price });
        console.log(server);

        cache.delete(id);

        res.json({
            source: server,
            message: 'Update processed successfully',
            data: response.data,
        });
    } catch (error) {
        res.status(500).send('Error processing update');
    }
});

app.post('/invalidate', (req, res) => {
    const { itemId } = req.body;
    invalidationRequests.add(itemId);
    res.status(200).send('cache invalidation request received');
});

app.listen(3000, () => {
    console.log('Front-end server started on port 3000');
});
