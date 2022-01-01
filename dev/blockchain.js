const sha256 = require('sha256')
const currentNodeUrl = process.argv[3];
const { v4: uuidv4 } = require('uuid');

function Blockchain () {
    this.chain = [];
    this.pendingTransactions = [];
 
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = []; //every node will be aware of all the other nodes
    
    this.createNewBlock(100, '0', '0') //Genesis block
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions, 
        nonce: nonce, //nonce is a number, proof that we created a new block in a legit way
        hash: hash, 
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
};

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount, 
        sender: sender,
        recipient: recipient,
        transactionId: uuidv4().split('-').join('')
    };

    return newTransaction;

    // return this.getLastBlock()['index'] + 1; //return number of block transaction added to
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash; 
}
 
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    while (hash.substring(0, 4) !== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        //  console.log("hash : " + hash)
    }

    return nonce;
}

module.exports = Blockchain

