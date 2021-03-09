# Directory

Mongoose repro script

## Testing

Run local mongod for testing. Collections are wiped during testing.

### Replica set - recommended

```sh
npm install run-rs -g
run-rs -v 4.2.3
```

Run mocha tests:
```sh
MONGODB_URL=mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs npm run test
```
