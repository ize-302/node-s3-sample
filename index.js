const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer');
const s3 = require('./lib/s3')
const upload = require('./lib/mutter')

const dotenv = require('dotenv');
dotenv.config();

const { AWS_S3_BUCKET_NAME, PORT } = process.env

// static
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))

// routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// upload file
app.post('/upload', async (req, res) => {
  await upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).send(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).send(err);
    }

    const files = req.files
    const folder = req.body.type === 'photo' ? 'photos/' : 'videos/'

    for (let i = 0; i < files.length; i++) {
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: folder + files[i].originalname,
        Body: files[i].buffer,
        ContentType: files[i].mimetype,
      };
      try {
        await s3.upload(params).promise();
        if (i === files.length - 1)
          res.status(200).send('File uploaded to S3 successfully!');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file to S3');
      }

    }
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})