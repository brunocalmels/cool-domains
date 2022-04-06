const main = async () => {
    const [owner, blackhatDude] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy('2022');
    await domainContract.deployed();
    console.log("Contract deployed. Address:", domainContract.address);
    console.log("Contract deployed by:", owner.address);

    let tx = await domainContract.register(
        "messi",
        { value: hre.ethers.utils.parseEther('0.0001') }
    );
    await tx.wait();
    console.log("Minted domain messi.2022");

    const domainOwner = await domainContract.getAddress("messi");
    console.log("Owner of domain: %s", domainOwner);

    txn = await domainContract.
        setRecord("messi", "Go Messi go!");
    await txn.wait();
    console.log("Set record for domain messi.2022");

    try {
        txn = await domainContract.
            connect(blackhatDude).
            setRecord("messi", "Go Messi go!");
        await txn.wait();
        console.log("Could set somebody else's record!");
    } catch (e) {
        console.log("Could not set somebody else's record")
    }

    try {
        txn = await domainContract.connect(blackhatDude).withdraw();
        await txn.wait();
    } catch (e) {
        console.log("Could not rob funds! 😿")
    }

    // Let's look in their wallet so we can compare later
    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

    // Oops, looks like the owner is saving their money!
    txn = await domainContract.connect(owner).withdraw();
    await txn.wait();

    // Fetch balance of contract & owner
    const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
    ownerBalance = await hre.ethers.provider.getBalance(owner.address);

    console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
    console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();