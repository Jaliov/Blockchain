const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2];
//The process. argv property is an inbuilt application programming interface of the process module which is used to get the arguments passed to the node. js process when run in the command line. Syntax: process.argv
const rp = require('request-promise')

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

//register a node and broadcast it to the network
app.post('.register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    bitcoin.networkNodes.indexOf(newNodeUrl) == -1 ? bitcoin.networkNodes.push(newNodeUrl) : null;
    
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
       const requestOptions = {
         uri: networkNodeUrl + '/register-node',  //make request to each node, async
         method: 'POST',
         body: { newNodeUrl: newNodeUrl },
         json: true
       }

       regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(reNodesPromises) 
    .then(data => {
      // use the data...
    })
    
});


app.post('/register-node', (req, res) => {
   
});

//register multiple nodes at wonce
app.post('/register-nodes-bulk', () => {

})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
