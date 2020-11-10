// 3p
import { Config } from '@foal/core';
import { connect, disconnect, connection } from 'mongoose';

export async function main(args: any) {
  const uri = Config.getOrThrow('mongodb.uri', 'string');
  await connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

  await connection.db.dropCollection('userclasses');

  await disconnect();
}
