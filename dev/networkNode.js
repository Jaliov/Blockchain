const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2];
//The process. argv property is an inbuilt application programming interface of the process module which is used to get the arguments passed to the node. js process when run in the command line. Syntax: process.argv
const rp = require('request-promise');
// const req = require("express/lib/request");
// const res = require("express/lib/response");

const nodeAddress = uuidv4().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function(req, res) {
    // console.log(req.body);
  res.send(bitcoin);
});

// let rbdy = req.body;

app.post('/transaction', function(req, res) {
   const newTransaction = req.body;
   const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
   res.json({ note: `Transaction added in block ${blockIndex}.`});
});

app.post('/transaction/broadcast', function(req, res) {
   const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
   bitcoin.addTransactionToPendingTransactions(newTransaction);

   const requestPromises = [];
   bitcoin.networkNodes.forEach(networkNodeUrl => {
      const requestOptions = {
        uri: networkNodeUrl + '/transaction',
        method: 'POST',
        body: newTransaction,
        json: true
      }; //broadcast transaction to all other nodes at their '/transaction' endpoint, cycle. After createing all requests run them with Promise.All 

      requestPromises.push(rp(requestOptions));   
   });
  
   Promise.all(requestPromises)
  .then(data => {
    res.json({ note: 'Transaction created and broadcast successfully!'})
  });
});

app.get('/mine', (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];

  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock: newBlock }, 
      json: true
    };

   requestPromises.push(rp(requestOptions));
  })

  Promise.all(requestPromises)
  .then(data => {
     const requestOptions = {
       uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
       method: 'POST', 
       body: {
         amount: 12.5, 
         sender: "00",
         recipient: nodeAddress
       }, 
       json: true
     };

     return (rp(requestOptions));
  })
    .then(data => {
      res.json({
        note: "New block broadcast and mined, out'a sight!",
        block: newBlock
      })
    });
});

app.post('/receive-new-block', function(req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({
      note: 'New bock received and accepted, baby!'
    });
  }
   else {
     res.json({
       note: 'This here new block rejected!',
       newBlock: newBlock
     });
   }
});

//register a node and broadcast it to the network
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);
    
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
       const requestOptions = {
         uri: networkNodeUrl + '/register-node',  //make request to each node, async
         method: 'POST',
         body: {newNodeUrl: newNodeUrl},
         json: true
       }
       regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises) 
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ]},
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then(data => {
       res.json({ note: 'New node registered with network successfully!'})

    })
    
});

app.post('/register-node', (req, res) => {
   const newNodeUrl = req.body.newNodeUrl; 
   const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1
   const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
   if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	 res.json({ note: 'New node registered successfully.' });
});

//register multiple nodes at wonce
app.post('/register-nodes-bulk', (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
  })
    res.json({ note: 'Bulk registration successful!' });
}); 

app.get('/consensus', function(req, res ) {
  const requestPromises = [];
   bitcoin.networkNodes.forEach(networkNodeUrl => {
     const requestOptions = {
       uri: networkNodeUrl + '/blockchain',
       method: 'GET',
       json: true
     };

     requestPromises.push(rp(requestOptions));
   });

   Promise.all(requestPromises)
   .then(blockchains => {
     const currentChainLength = bitcoin.chain.length;
     let maxChainLength = currentChainLength;
     let newLongestChain = null;
     let newPendingTransactions = null; 

     blockchains.forEach(blockchain => {
        if (blockchain.chain.length > maxChainLength) {
          maxChainLength = blockchain.chain.length; 
          newLongestChain = blockchain.chain; 
          newPendingTransactions = blockchain.pendingTransactions;
        };
      });

      if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
      res.json({
        note: 'Current chain has not been replaced',
        chain: bitcoin.chain
      });
   }
   else if (newLongestChain && bitcoin.chainIsValid(newLongestChain)) {
    bitcoin.chain = newLongestChain;
    bitcoin.newPendingTransactions = newPendingTransactions;
    res.json({
      note: 'This chain has been replaced',
      chain: bitcoin.chain  //already replaced
    });
   }
  });
});

app.get('/block/:blockHash', function(req, res) { //localhost:3001/block/
    const blockHash = req.params.blockHash; 
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
      block: correctBlock
    })
});

app.get('/transcaction/:transactionId', function(req, res) {

});

app.get('/address/:address', function(req, res) {

});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
})
