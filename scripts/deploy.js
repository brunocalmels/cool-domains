const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy('2022');
    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);
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

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
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