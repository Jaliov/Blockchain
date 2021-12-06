const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

bitcoin.createNewBlock(2235, 'OINA90DNF90N', '90ANSD9F0N9009N');

bitcoin.createNewTransaction(100, 'ALEXSD89F9WON90A', 'JENN0AN09N09A9');  //amount, sender, address

bitcoin.createNewBlock(1111, 'OYTRNF90M', 'KJANSD9F0CVF9N');

bitcoin.createNewTransaction(300, 'ALEXSD89F9WON90A', 'JENN0AN09N09A9');
bitcoin.createNewTransaction(2000, 'ALEXSD89F9WON90A', 'JENN0AN09N09A9');


 bitcoin.createNewBlock(15621, 'SINSD89F9WON90A', 'JANN0AN09N09A9');

bitcoin.createNewTransaction(5000, 'BOOBYSD878GWON90A', 'ASDN0AN09N09A9');

bitcoin.createNewBlock(17821, 'SINSD89F9WON90A', 'JANN0AN09N09A9');




console.log(bitcoin.chain[2]);