const mongoose = require("mongoose");

async function connect(params) {
    try {
        await mongoose.connect(process.env.MONGO_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoogse connected");

    } catch (error) {
        console.log(error);
        
    }
}
 

module.exports = { connect };