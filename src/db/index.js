import { v4 as uuid } from "uuid";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

/**
 * Get all items from a table
 * @param {string} TableName - The name of the table
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").ScanCommandOutput>} - A promise that resolves to an array of items
 */
export async function getTable(TableName) {
  return await docClient.send(new ScanCommand({ TableName }));
}

/**
 * Get an item from a table
 * @param {string} TableName - The name of the table
 * @param {object} Key - The key to use for the item
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").GetCommandOutput>} - A promise that resolves to an object containing the item
 */
export async function getItem(TableName, Key) {
  return await docClient.send(new GetCommand({ TableName, Key }));
}

/**
 * Add an item to a table
 * @param {string} TableName - The name of the table
 * @param {object} Item - The item to add
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>} - A promise that resolves to an object containing the added item
 */
export async function addItem(TableName, newItem) {
  const Item = { _id: newItem._id || uuid(), ...newItem };
  Item.created_date = Date.now();
  return await docClient.send(
    new PutCommand({
      TableName,
      Item,
    })
  );
}

/**
 * Delete an item from a table
 * @param {string} TableName - The name of the table
 * @param {object} Key - The key to use for the item
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>} - A promise that resolves to an object containing the deleted item
 */
export async function deleteItem(TableName, Key) {
  return await docClient.send(new DeleteCommand({ TableName, Key }));
}

function buildUpdateExpression(Item) {
  let UpdateExpression = "set";
  const ExpressionAttributeValues = {};
  for (const key in Item) {
    UpdateExpression += ` ${key} = :${key},`;
    ExpressionAttributeValues[`:${key}`] = Item[key];
  }
  UpdateExpression = UpdateExpression.slice(0, -1);
  return { UpdateExpression, ExpressionAttributeValues };
}

/**
 * Update an item in a table
 * @param {string} TableName - The name of the table
 * @param {object} Key - The key to use for the item
 * @param {object} Item - The item to update
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>} - A promise that resolves to an object containing the updated item
 */
export async function updateItem(TableName, Key, Item) {
  /** @type {import("@aws-sdk/lib-dynamodb").UpdateCommandInput} */
  const param = {
    TableName,
    Key,
    ...buildUpdateExpression(Item),
  };
  return await docClient.send(new UpdateCommand(param));
}
