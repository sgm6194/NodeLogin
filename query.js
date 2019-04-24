'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '/home/user/workspace/github/fabric-samples/first-network/fabcar-2orgs/', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

var myFunc1 = async function getQuery() {
    try {

        // Create a new file system based wallet for managing identities.
        // const walletPath = path.join(process.cwd(), 'wallet');
        const walletPath = "/home/user/workspace/github/fabric-samples/first-network/fabcar-2orgs/wallet";
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('asd16');
        if (!userExists) {
            console.log('An identity for the user "asd16" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'asd16', discovery: { enabled: false } });
        // console.log(gateway);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        console.log('got channel');
        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        // const result = await contract.evaluateTransaction('query','b');
        // const result1 = await contract.submitTransaction('invoke','a','b','10');
        const result = await contract.evaluateTransaction('query','a');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        console.log('sending value');
        return result;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
exports.myFunc1 = myFunc1;
// main();