const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const orderFile = 'C:/Users/Hp/Desktop/apps/dos/dosproject/orders.csv';
const bookFile = 'C:/Users/Hp/Desktop/apps/dos/dosproject/proj.csv';

app.use(express.json());

function logOrder(order) {
    const csvWriter = createCsvWriter({
        path: orderFile,
        header: [
            { id: 'order_id', title: 'order_id' },
            { id: 'item_id', title: 'item_id' },
            { id: 'title', title: 'title' },
            { id: 'quantity', title: 'quantity' },
        ],
        append: true,
    });
    return csvWriter.writeRecords([order]);
}

function readBooks() {
    return new Promise((resolve, reject) => {
        const books = [];
        fs.createReadStream(bookFile)
            .pipe(csvParser())
            .on('data', (row) => {
                books.push(row);
            })
            .on('end', () => resolve(books))
            .on('error', (error) => reject(error));
    });
}

function writeBooks(books) {
    const csvWriter = createCsvWriter({
        path: bookFile,
        header: [
            { id: 'id', title: 'id' },
            { id: 'title', title: 'title' },
            { id: 'author', title: 'author' },
            { id: 'topic', title: 'topic' },
            { id: 'price', title: 'price' },
            { id: 'stock', title: 'stock' },
        ],
    });
    return csvWriter.writeRecords(books);
}

app.post('/purchase/:item_number', async (req, res) => {
    const itemNumber = req.params.item_number;
    const purchaseAmount = parseInt(req.body.amount, 10);
    if (!purchaseAmount || purchaseAmount <= 0) {
        return res.status(400).send('Invalid purchase amount.');
    }
    try {
        const books = await readBooks();
        const bookIndex = books.findIndex(book => book.id === itemNumber);
        if (bookIndex === -1) {
            return res.status(404).send('Book ID not found.');
        }
        const book = books[bookIndex];
        const currentStock = parseInt(book.stock, 10);
        if (purchaseAmount > currentStock) {
            return res.status(400).send(`Insufficient stock. Available stock: ${currentStock}`);
        }
        books[bookIndex].stock = (currentStock - purchaseAmount).toString();
        const order = {
            order_id: Date.now().toString(),
            item_id: itemNumber,
            title: book.title,
            quantity: purchaseAmount,
        };
        await logOrder(order);
        await writeBooks(books);
        res.json({ message: `Book purchased successfully: ${book.title}`, order });
    } catch (error) {
        res.status(500).send('Error processing purchase');
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
const port = process.argv[2] || 3002;
app.listen(port, () => {
    console.log(`Order server started on port ${port}`);
});

