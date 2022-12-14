const {moveBlocks} = require('../utils/move-blocks')

const BLOCKS = 2;
const SLEEP = 1000

const mine= async() => {
    await moveBlocks(BLOCKS, SLEEP);
}

mine()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })