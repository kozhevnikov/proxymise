const AWS = require('aws-sdk');
const proxymise = require('..');

AWS.config.update({
  region: 'eu-west-2',
  endpoint: 'http://localhost:8000'
});

const dynamodb = new AWS.DynamoDB();
const client = new AWS.DynamoDB.DocumentClient();
const client2 = proxymise(new AWS.DynamoDB.DocumentClient());

describe('DynamoDB', () => {
  const id = Date.now();
  const table = `table-${id}`;
  const key = { TableName: table, Key: { id } };

  beforeAll(async () => {
    await dynamodb.createTable({
      TableName: table,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'N' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      }
    }).promise();

    await client.put({
      TableName: table,
      Item: {
        id,
        foo: {
          bar: 'baz'
        }
      }
    }).promise();
  });

  it('should get item without proxymise', async () => {
    const data = await client.get(key).promise();
    const value = data.Item.foo.bar;
    expect(value).toBe('baz');
  });

  it('should get item with proxymise', async () => {
    const value = await client2.get(key).promise().Item.foo.bar;
    expect(value).toBe('baz');
  });
});
