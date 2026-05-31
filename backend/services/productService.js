const {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const { docClient, s3Client } = require("../config/aws");

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const BUCKET_NAME = process.env.S3_BUCKET;

async function createProduct(product) {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: product
    })
  );

  return product;
}

async function getAllProducts() {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLE_NAME
    })
  );

  return result.Items || [];
}

async function getProductById(productId) {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { productId }
    })
  );

  return result.Item;
}

async function updateProduct(productId, updates) {
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updates).forEach((key) => {
    updateExpressions.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = updates[key];
  });

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { productId },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    })
  );

  return result.Attributes;
}

async function deleteProduct(productId) {
  const product = await getProductById(productId);

  if (!product) {
    return null;
  }

  if (product.imageKey) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: product.imageKey
      })
    );
  }

  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { productId }
    })
  );

  return product;
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};