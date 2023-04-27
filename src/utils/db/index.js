import { v4 as uuid } from "uuid";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBClient,
  QueryCommand,
  ExecuteStatementCommand,
} from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

export const docClient = new DynamoDBClient({
  regions: process.env.AWS_REGION,
});

/**
 * Get all items from a table
 * @param {string} TableName - The name of the table
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").ScanCommandOutput>} - A promise that resolves to an array of items
 */
function getTable(TableName) {
  return docClient.send(new ScanCommand({ TableName }));
}

/**
 * Get an item from a table
 * @param {string} TableName - The name of the table
 * @param {object} Key - The key to use for the item
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").GetCommandOutput>} - A promise that resolves to an object containing the item
 */
function getItem(TableName, Key) {
  return docClient.send(new GetCommand({ TableName, Key }));
}

/**
 * Get an items from a table
 * @param {string} TableName - The name of the table
 * @param {object} options - The options of the query.
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>} - A promise that resolves to an object containing the item
 */
async function queryItems(TableName, options) {
  return await docClient.send(new QueryCommand({ ...options, TableName }));
}

/**
 * Add an item to a table
 * @param {string} TableName - The name of the table
 * @param {object} Item - The item to add
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>} - A promise that resolves to an object containing the added item
 */
function addItem(TableName, newItem) {
  const Item = { id: newItem.id || uuid(), ...newItem };
  Item.created_date = Date.now();

  return docClient.send(
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
function deleteItem(TableName, Key) {
  return docClient.send(new DeleteCommand({ TableName, Key }));
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
function updateItem(TableName, Key, Item) {
  /** @type {import("@aws-sdk/lib-dynamodb").UpdateCommandInput} */
  const param = {
    TableName,
    Key,
    ...buildUpdateExpression(Item),
  };
  return docClient.send(new UpdateCommand(param));
}

/**
 * @description Query items from a table with simple query, only key = value is support (1 key equal condition).
 * @param {string} TableName - name of the table which is queried. (required)
 * @param {object} key - key of the index. (required)
 * @param {object} value - value that is queried. (required)
 * @param {number} limit - maxmimum record which will be retrieved.
 * @param {string} indexName - name of the index. (primary is used if not provided)
 * @param {boolean} ascending - retrieved record in ascending order or not.
 * @param {string} startKey - key of the starting record.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/querycommand.html}
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>} - A promise that resolves to an object containing the item
 */
export async function simpleQuery(
  TableName,
  key,
  value,
  { limit, indexName, ascending, startKey }
) {
  const param = {
    TableName,
    ...buildSimpleQueryExpression(
      key,
      value,
      limit,
      indexName,
      ascending,
      startKey
    ),
  };
  return await docClient.send(new QueryCommand(param));
}

/**
 * @description simple query builder
 * @param {object} key - key of the index. (required)
 * @param {object} value - value that is queried. (required)
 * @param {number} limit - maxmimum record which will be retrieved.
 * @param {string} indexName - name of the index. (primary is used if not provided)
 * @param {boolean} ascending - retrieved record in ascending order or not.
 * @param {string} startKey - key of the starting record.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/querycommand.html}
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>} - A promise that resolves to an object containing the item
 */
function buildSimpleQueryExpression(
  key,
  value,
  limit,
  indexName,
  ascending,
  startKey
) {
  let ty;
  switch (typeof value) {
    case "string":
      ty = "S";
      break;
    case "number":
      ty = "N";
      break;
    default:
      throw "Invalid type";
  }
  return {
    ExpressionAttributeValues: {
      ":v": { [ty]: value },
    },
    KeyConditionExpression: `${key} = :v`,
    IndexName: indexName ?? undefined,
    Limit: limit ?? undefined,
    ExclusiveStartKey: startKey ?? undefined,
    ScanIndexForward: ascending ?? true,
  };
}

/**
 * Flatten result of database query into more readable format
 * @param {Array<Record<string, AttributeValue>>} items
 * @returns {Array<object>} flatten version of input
 */
function flattenItems(items) {
  return items.map(flattenItem);
}

/**
 * Flatten single item that was retrieved from database query into more readable format
 * @param {Record<string, AttributeValue>} item
 * @throws Will throw if the value not in Record<string, AttributeValue> format
 * @returns {object} flatten version of input
 */
function flattenItem(item) {
  const result = {};
  for (const key in item) {
    const attributeValue = item[key];
    if (
      typeof attributeValue !== "object" ||
      Array.isArray(attributeValue) ||
      attributeValue === null ||
      Object.keys(attributeValue).length === 0
    ) {
      throw "Invalid format";
    }

    const [ty, value] = Object.entries(attributeValue)[0];

    let parsedValue;

    switch (ty) {
      // TODO: parse complex type
      case "N":
        parsedValue = Number.parseFloat(value);
        break;
      default:
        parsedValue = value;
    }

    result[key] = parsedValue;
  }

  return result;
}

export default {
  getTable,
  getItem,
  addItem,
  deleteItem,
  updateItem,
  queryItems,
  simpleQuery,
  flattenItem,
  flattenItems,
};
