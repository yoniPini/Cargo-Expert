const {
	getSolutionsJS,
	improveSolutionJS,
	userInputExample,
	createUser,
	readUser,
	deleteUser,
	updateUser,
} = require("./middlewares.js");

const { mongoose } = require("./db.js");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 1337;

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname + "/public")));

app.post("/getSolutionsJS", (req, res) => getSolutionsJS(req, res));
app.post("/improveSolutionJS", (req, res) => improveSolutionJS(req, res));
app.get("/userInputExample", (req, res) => userInputExample(req, res));

// User CRUD - Should have used multiple API calls instead of doing two operations in one API call
app.post("/createUser", (req, res) => createUser(req, res));
app.post("/readUser", (req, res) => readUser(req, res));
app.post("/deleteUser", (req, res) => deleteUser(req, res));
app.post("/updateUser", (req, res) => updateUser(req, res));

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
