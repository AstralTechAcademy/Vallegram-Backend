const dotenv = require('dotenv');
const express = require('express')
dotenv.config();
const app = express()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/feed', async (req, res) => {
  await client.connect()
  const posts = await client.db("ElValle-App").collection("feed").aggregate([
    {
      $match: {
              user_id: new ObjectId(req.query.userId),
          }
    },
    {
    $lookup: {
            from: "posts",
            localField: "post_id",
            foreignField: "_id",
            as: "post_details"
        }
    },
    { $unwind: "$post_details" },
    {
    $lookup: {
            from: "users",
            localField: "post_details.user_id",
            foreignField: "_id",
            as: "user_details"
        }
    },
    { $unwind: "$user_details" },
    ]).toArray()

    res.send(JSON.stringify(posts, null, 2))
})

app.get('/stories', async (req, res) => {
  await client.connect()
  const stories = await client.db("ElValle-App").collection("stories").aggregate([
    {
      $match: {
              user_id: new ObjectId(req.query.userId),
          }
    },
    {
    $lookup: {
            from: "users",
            localField: "story_data.user_id",
            foreignField: "_id",
            as: "user_details"
        }
    },
    { $unwind: "$user_details" }
    ]).toArray()

    res.send(JSON.stringify(stories, null, 2))
})

app.post('/like', async (req, res) => {
  await client.connect()
  const result = await client.db("ElValle-App").collection("likes").insertOne(
    {
      "user_id": new ObjectId(req.query.userId),
      "post_id": new ObjectId(req.query.postId)
    })

    res.send(JSON.stringify(result))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
