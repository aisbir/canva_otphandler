// index.js clean code by asbircube

const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const mongoURI = 'mongodb+srv://bjirgann:aisbirgaming@cluster0.jqfnmva.mongodb.net/';
const client = new MongoClient(mongoURI)
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const mongoapikey = 'mongodb+srv://susiber:rushidev123@cluster0.3dweg2k.mongodb.net/';
const clientss = new MongoClient(mongoapikey)
mongoconect()
app.get('/api/get/current/ver/autoco', async (req, res) => {
  const apikey = req.query.apikey;
  try {
    await client.connect();
    await clientss.connect();
    const database = client.db('version');
    const collection = database.collection('co');
    const databass = clientss.db('asbir');
    const collectionn = databass.collection('lisensi');
    const resultt = await collectionn.findOne({ apikey: apikey });
    const result = await collection.find({}).toArray();

    // Sort the commits array by timestamp in descending order
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const commit = result.length > 0 ? {
      _id: result[0]._id,
      sha: result[0].sha,
      message: result[0].message,
      timestamp: result[0].timestamp,
    } : null;

    const response = {
      status: true,
      script_type: "botautocheckout",
      information: {
        author: "@aisbircubes",
        isPaid: true
      },
      commits: commit,
      all_commits: result
    };

    if (!apikey) {
      return res.status(401).json({ status: false, message: "You aren't authorized to visit this endpoint" });
    } else if (resultt) {
      res.json(response);
    } else {
      res.json({ status: false, message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});



app.post('/api/post/current/ver/autoco', async (req, res) => {
  
  try {
    await client.connect();
    const database = client.db('version');
    const collection = database.collection('co');
    const { sha, message } = req.body;
    if (!sha || !message) {
      return res.status(400).json({ status: false, error: 'Missing required parameters' });
    }
    const document = {
      sha,
      message,
      timestamp: new Date(),
    };
    const result = await collection.insertOne(document);
    await client.close();
    const response = {
      status: true,
      message: 'Saved current version...',
      insertedId: result.insertedId,
    };
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});
app.get('/api/get/updater/botautocheckout', async (req, res) => {
  const { apikey, sha} = req.query

  try {
    const database = clientss.db('asbir');
    const collection = database.collection('lisensi');
    const result = await collection.findOne({ apikey: apikey });

    if (result) {
      res.json({status: true, sha: sha, zip: `https://jar.aisbircubes.my.id/botautocheckout/${sha}.zip`, code: 202});
    } else {
     return res.status(405).json({status: false, message: "Apikey Invalid Please Input Your Valid Apikey", code: 405})
    }
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

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
  app.get('/api/get/delete/canva/:gmail', async (req, res) => {
    const { gmail } = req.params;

    console.log("New Otp Arrived\n" + gmail);

    try {
        const db = client.db('otp');
        const collection = db.collection('canva');

        const result = await collection.deleteOne({ email: gmail });

        if (result.deletedCount > 0) {
      
            res.json({ status: true, message: 'Deleted' });
        } else {
            res.json({ status: false, message: 'Data Not found' });
        }
    } catch (error) {
        console.error('Error deleting data from MongoDB:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
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

async function mongoconect() {
  await client.connect();
  await clientss.connect();
}
