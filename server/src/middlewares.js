const { algo } = require("./algo_js/algo.js");
const { improve } = require("./algo_js/improve.js");
const path = require("path");
let PythonShellLibrary = require("python-shell");
let { PythonShell } = PythonShellLibrary;
const crypto = require("crypto");
const { User } = require("./models/data_base.js");

const Paths = {
	pythonAlgorithmPath: "/algo_py/algo.py",
	pythonAlgorithmTwoPath: "/algo2_py/algo.py",
	pythonImprovePath: "src\\algo_py\\improve.py",
	downloadFilePath: "./user_input_example.csv",
};

const Errors = {
	solutionError: "Could not get solutions",
	improveError: "There was a problem improving your solution",
	downloadFileError:
		"Can't download file at this time. Please try again later",
	emailError: "Email already exists",
	loginError: "Invalid login credentials",
	userError: "Invalid user",
};

const parse_response_from_algo = (result) => {
	result_string = result[0];
	result_string = result_string.replace(/ /g, "");
	result_string = result_string.replace(/'/g, '"');
	result_json = JSON.parse(result_string);
	return result_json;
};

const getSolutions = (req, res) => {
	const scriptPath = path.join(__dirname, Paths.pythonAlgorithmPath);
	options = {
		args: [JSON.stringify(req.body)],
		pythonOptions: ["-u"], // The '-u' tells Python to flush every time // get print results in real-time
	};
	PythonShell.run(scriptPath, options, function (err, result) {
		if (err) {
			console.log(err.traceback);
		} else {
			result = parse_response_from_algo(result);
			res.send(result);
		}
	});
};

const getSolutionsJS = (req, res) => {
	try {
		const solutions = algo(req.body);
		res.send(solutions);
	} catch (err) {
		res.status(400).json({ error: Errors.solutionError });
	}
};

const getSolutions2 = (req, res) => {
	const scriptPath = path.join(__dirname, Paths.pythonAlgorithmTwoPath);
	options = {
		args: [JSON.stringify(req.body)],
		pythonOptions: ["-u"], // The '-u' tells Python to flush every time // get print results in real-time
	};
	PythonShell.run(scriptPath, options, function (err, result) {
		if (err) {
			console.log(err.traceback);
		} else {
			result = parse_response_from_algo(result);
			res.send(result);
		}
	});
};

const improveSolution = (req, res) => {
	options = {
		args: [JSON.stringify(req.body)],
		pythonOptions: ["-u"], // The '-u' tells Python to flush every time // get print results in real-time
	};
	PythonShell.run(Paths.pythonImprovePath, options, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			result = parse_response_from_algo(result);
			res.send(result);
		}
	});
};

const improveSolutionJS = (req, res) => {
	try {
		const solutions = improve(req.body);
		res.send(solutions);
	} catch (err) {
		res.status(400).json({
			error: Errors.improveError,
		});
	}
};

const userInputExample = (req, res) => {
	try {
		res.download(Paths.downloadFilePath);
	} catch (err) {
		res.status(400).json({
			error: Errors.downloadFileError,
		});
	}
};

const createUser = async (req, res) => {
	sha = crypto.createHash("sha256");
	try {
		await User.create({
			email: req.body.email.trim(),
			password: sha.update(req.body.password.trim()).digest("hex"),
		});
		res.sendStatus(200);
	} catch (err) {
		if (err.message.includes("duplicate key error")) {
			res.status(400).json({
				error: Errors.emailError,
			});
		}
		if (err.errors.email) {
			const emailError = err.errors.email.properties.message;
			if (emailError) {
				res.status(400).json({
					error: emailError,
				});
			}
		}
		if (err.errors.password) {
			console.log(err.errors);
			const passwordError = err.errors.password.properties.message;
			console.log(passwordError);
			if (passwordError) {
				res.status(400).json({
					error: passwordError,
				});
			}
		}
	}
};

const readUser = async (req, res) => {
	sha = crypto.createHash("sha256");
	User.findOne(
		{
			email: req.body.email,
			password: sha.update(req.body.password).digest("hex"),
		},
		(err, data) => {
			if (err) {
				res.status(400).json({ error: err.message });
			} else {
				if (data) {
					res.status(200).json(data.projects);
				} else {
					res.status(400).json({
						error: Errors.loginError,
					});
				}
			}
		}
	);
};

const deleteUser = (req, res) => {
	sha = crypto.createHash("sha256");
	User.deleteOne(
		{
			email: req.body.email,
			password: sha.update(req.body.password).digest("hex"),
		},
		(err, data) => {
			if (err) {
				res.send(err);
			} else {
				res.send(data);
			}
		}
	);
};

const updateUser = (req, res) => {
	sha = crypto.createHash("sha256");
	User.findOne(
		{
			email: req.body.email,
			password: sha.update(req.body.password).digest("hex"),
		},
		(err, data) => {
			if (err) res.send(err);
			else {
				if (data) {
					data.projects = req.body.newProjects;
					data.populate({
						path: "projects",
						populate: {
							path: "boxes",
							model: "Box",
							path: "solutions",
							populate: {
								path: "boxes",
								model: "Box",
							},
						},
					});
					data.save();
					res.sendStatus(200);
				} else {
					res.status(400).json({ error: Errors.userError });
				}
			}
		}
	);
};

const serverListen = (port) => {
	console.log(`listening on port ${port}`);
};

module.exports = {
	getSolutions,
	getSolutionsJS,
	improveSolutionJS,
	improveSolution,
	userInputExample,
	createUser,
	readUser,
	deleteUser,
	updateUser,
	serverListen,
};
