const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify/sync');
const axios = require('axios');

const app = express();
const csvFilePath = 'C:/Users/Hp/Desktop/apps/dos/dosproject/proj.csv';
const port = process.argv[2] || 3001;
app.use(express.json());

function readCatalog() {
    return new Promise((resolve, reject) => {
        const catalog = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                data.id = parseInt(data.id);
                data.price = parseFloat(data.price);
                data.stock = parseInt(data.stock);
                catalog.push(data);
            })
            .on('end', () => resolve(catalog))
            .on('error', (error) => reject(error));
    });
}

function saveCatalog(catalog) {
    const csvData = stringify(catalog, { header: true });
    fs.writeFileSync(csvFilePath, csvData, 'utf8');
}

async function notifyFrontend(itemId) {
    try {
        await axios.post('http://localhost:3000/invalidate', { itemId });
    } catch (error) {
        console.error('Cache invalidation failed', error);
    }
}
app.get('/info/:item_number', async (req, res) => {
    try {
        const itemNumber = parseInt(req.params.item_number);
        const catalog = await readCatalog();
        const book = catalog.find(book => book.id === itemNumber);
        book ? res.json(book) : res.status(404).send('Book not found');
    } catch (error) {
        res.status(500).send('Error reading catalog');
    }
});
app.get('/status', async (req, res) => {
    try {
  res.send(
    "RUN"
  )
    } catch (error) {
        res.status(404).send('notfound');
    }
});
app.get('/search/:topic', async (req, res) => {
    try {
        const topic = req.params.topic.toLowerCase();
        const catalog = await readCatalog();
        const result = catalog.filter(book => book.topic.toLowerCase() === topic);
        result.length > 0 ? res.json(result) : res.status(404).send('No books found for this topic');
    } catch (error) {
        res.status(500).send('Error reading catalog');
    }
});

app.put('/update', async (req, res) => {
    try {
        const { id, stock, price } = req.body;
        const catalog = await readCatalog();
        const book = catalog.find(book => book.id === id);
        if (book) {
            if (stock !== undefined) book.stock = stock;
            if (price !== undefined) book.price = price;
            saveCatalog(catalog);
            notifyFrontend(id);
            res.json(book);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send('Error updating catalog');
    }
});

app.listen(port, () => {
    console.log(`Catalog server started on port ${port}`);
});
