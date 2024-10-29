const express = require('express');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();

app.use(express.json());

const orderFile = 'C:\\Users\\Hp\\Desktop\\apps\\dos\\dosproject\\orders.csv';

function logOrder(order) {
    const csvWriter = createCsvWriter({
        path: orderFile,
        header: [
            { id: 'order_id', title: 'order_id' },
            { id: 'item_id', title: 'item_id' },
            { id: 'title', title: 'title' },
            { id: 'quantity', title: 'quantity' }
        ],
        append: true
    });
    return csvWriter.writeRecords([order]);
}

app.post('/purchase/:item_number', async (req, res) => {
    const itemNumber = req.params.item_number;
    const order = {
        order_id: Date.now().toString(),
        item_id: itemNumber,
        title: req.body.title, 
    };
    try {
        await logOrder(order);
        res.json({ message: `Book purchased successfully: ${order.title}`, order });
    } catch (error) {
        res.status(500).send('Error logging order');
    }
});

app.listen(3002, () => {
    console.log(`run order successfully started`);
});
