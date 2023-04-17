import { v4 as uuid } from "uuid";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
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
 * Add an item to a table
 * @param {string} TableName - The name of the table
 * @param {object} Item - The item to add
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>} - A promise that resolves to an object containing the added item
 */
export async function addItem(TableName, Item) {
  const Item = { _id: Item._id || uuid(), ...Item };
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
    AttributeUpdates: {
      ...Item,
    },
  };
  return await docClient.send(new UpdateCommand(param));
}
