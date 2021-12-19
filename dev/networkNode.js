const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2];

const nodeAddress = uuidv4().split('-').join('');


const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', (req, res) => {
    console.log(req.body);
  res.send(bitcoin);
});

app.post("/transaction", (req, res) => {
  console.log(req.body);
  let rbdy = req.body;
  const blockIndex = bitcoin.createNewTransaction(
    rbdy.amount,
    rbdy.sender,
    rbdy.recipient
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get('/mine', (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1,
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: "New block mined, out'a sight!",
    block: newBlock
  });
});

app.listen(3000, () => {
  console.log(`Listening on port ${port}...`);
});
