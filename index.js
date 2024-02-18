// index.js clean code by asbircubes

const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const mongoURI = 'mongodb+srv://bjirgann:aisbirgaming@cluster0.jqfnmva.mongodb.net/';
const client = new MongoClient(mongoURI)

app.get('/api/get/canva/:gmail', async (req, res) => {
    const gmail = req.params.gmail;

    try {
      const db = client.db('otp');
      const collection = db.collection('canva');
      const result = await collection.findOne({ email: gmail });

      if (result) {
        res.json(result);
      } else {
        res.json({ status: true, message: 'Waiting For Code...', code: "CANVA_WAITING_FOR_CODE" });
      }
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  app.post('/api/post/canva/:gmail/:otp/:message', async (req, res) => {
    const { gmail, otp, message } = req.params;

    console.log("New Otp Arrived\n"+ gmail);

    try {
      const db = client.db('otp');
      const collection = db.collection('canva');
      const existingDocument = await collection.findOne({ email: gmail });

      if (existingDocument) {
        await collection.updateOne(
          { email: gmail },
          {
            $set: {
              otp: otp,
              message: message,
            },
          }
        );

        res.json({ status: true, message: 'Data Updated' });
      } else {
        const newDocument = {
          email: gmail,
          otp: otp,
          message: message,
        };
        await collection.insertOne(newDocument);

        res.json({ status: true, message: 'Sended!' });
      }
    } catch (error) {
      console.error('Error updating/creating data in MongoDB:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
app.get('/', (req, res) => {
  res.json({status: true, message: "Hi welcome to aisbirgarapannganu api!"})
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
