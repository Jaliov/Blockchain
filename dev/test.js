const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 = {

    "chain": [
    {
    "index": 1,
    "timestamp": 1641529793559,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1641529860928,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timestamp": 1641530022666,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "6a6f6c8679174ee2b42f8df9e4c9b7ee",
    "transactionId": "5b4e47e2274348729295cb542e2c04f4"
    },
    {
    "amount": 10,
    "sender": "NJUFUUFD7899WEERRRE",
    "recipient": "OEKJFJMF876KDKLDF0",
    "transactionId": "5ac8ff5812014fe8bb9105b12ccd76c7"
    },
    {
    "amount": 20,
    "sender": "NJUFUUFD7899WEERRRE",
    "recipient": "OEKJFJMF876KDKLDF0",
    "transactionId": "e87368eea0f84fa89589da76fe1ec5be"
    },
    {
    "amount": 30,
    "sender": "NJUFUUFD7899WEERRRE",
    "recipient": "OEKJFJMF876KDKLDF0",
    "transactionId": "8c4fbe1969de42e1a76e0ce07114efc0"
    }
    ],
    "nonce": 227499,
    "hash": "00006c02666e050e697c469e2edfcc3c8bc180e318a94aca766c4bb0ccb43439",
    "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timestamp": 1641530086380,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "6a6f6c8679174ee2b42f8df9e4c9b7ee",
    "transactionId": "3c4d997cc4924fee81de42c51528f4ec"
    },
    {
    "amount": 40,
    "sender": "NJUFUUFD7899WEERRRE",
    "recipient": "OEKJFJMF876KDKLDF0",
    "transactionId": "1380cf988d654938aa2590a155dc2a61"
    },
    {
    "amount": 50,
    "sender": "NJUFUUFD7899WEERRRE",
    "recipient": "OEKJFJMF876KDKLDF0",
    "transactionId": "92c43449563c4f6fae6e352f14ab1b46"
    },
    {
    "amount": 60,
    "sender": "NJUFUUFD7899WEERRRE",
    "recipient": "OEKJFJMF876KDKLDF0",
    "transactionId": "c92babfd98ee40aa933bb2e357bed322"
    },
    {
    "amount": 70,
    "sender": "NJUFUUFD7899WEERRRE",
    "recipient": "OEKJFJMF876KDKLDF0",
    "transactionId": "9ff167982b0749e1b7bc815c01b0928c"
    }
    ],
    "nonce": 17639,
    "hash": "0000746ea653b0044f5205b40a8f61a9c346d48acf924d09bfeda2d7472bd12f",
    "previousBlockHash": "00006c02666e050e697c469e2edfcc3c8bc180e318a94aca766c4bb0ccb43439"
    },
    {
    "index": 5,
    "timestamp": 1641530130418,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "6a6f6c8679174ee2b42f8df9e4c9b7ee",
    "transactionId": "5ffa794e030b4a278e055394f6d117cc"
    }
    ],
    "nonce": 97589,
    "hash": "0000583a6e20e8aca1bdd989d6f910e13da0da4d6dd7b189a54d1201b998861b5", //changed here
    "previousBlockHash": "0000746ea653b0044f5205b40a8f61a9c346d48acf924d09bfeda2d7472bd12f"
    },
    
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "6a6f6c8679174ee2b42f8df9e4c9b7ee",
    "transactionId": "6367b7e1153e4cfca7b5b270df50f742"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    
}

console.log('VALID : ' + bitcoin.chainIsValid(bc1.chain));










