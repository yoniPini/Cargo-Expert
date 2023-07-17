const mongoose = require("mongoose");
const { CONNECTION_URL } = require("./config.js");

mongoose
	.connect(CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

module.exports = { mongoose };
