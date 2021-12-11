const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

console.log(bitcoin)

const previousBlockHash = 'JURT90ANSD9F0N9009N';
const currentBlockData = [
    {
        amount: 105, 
        sender: 'LKDJFJD432323SDWS123HJ',
        recipient: 'LOIGHF564FGGHJ0JNL'
    },
    {
        amount: 30, 
        sender: 'LKDJFJD43GH3SDW23HJ',
        recipient: 'BUD987HGHF564FGGHJ0323'
    },
    {
        amount: 200, 
        sender: 'LK87H432323SDWS123HJ',
        recipient: '987HGHF564323HJ0SlABY'
    },

];

// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
// console.log("This is the one that will make you lot's of $$ to buy candy:")
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 5733));













