const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");

const BUCKET_NAME = process.env.S3_BUCKET;

async function uploadImageToS3(file, key) {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  return key;
}

function getImageUrl(key) {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = {
  uploadImageToS3,
  getImageUrl
};