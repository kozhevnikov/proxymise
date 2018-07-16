const proxymise = require('..');

const AWS = require('aws-sdk');
const AWS2 = proxymise(require('aws-sdk'));

const config = {
  region: 'eu-west-2',
  endpoint: 'http://localhost:8000'
};

AWS.config.update(config);
AWS2.config.update(config);

describe('DynamoDB', () => {
  const id = Date.now();
  const table = `table-${id}`;
  const key = { TableName: table, Key: { id } };

  beforeAll(async () => {
    const dynamodb = new AWS.DynamoDB();
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

    const client = new AWS.DynamoDB.DocumentClient();
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
    const client = new AWS.DynamoDB.DocumentClient();
    const data = await client.get(key).promise();
    const value = data.Item.foo.bar;
    expect(value).toBe('baz');
  });

  it('should get item with proxymise', async () => {
    const client = new AWS2.DynamoDB.DocumentClient();
    const value = await client.get(key).promise().Item.foo.bar;
    expect(value).toBe('baz');
  });
});
