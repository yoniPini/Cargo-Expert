const Papa = require("papaparse");
const PythonShellLibrary = require("python-shell");
const { PythonShell } = PythonShellLibrary;
const path = require("path");
const fs = require("fs");
const { type } = require("os");

const filePath = "./easy1.csv";
const scriptPath = path.join(__dirname, "../../algo_py/algo.py");
const files_list = [
	// "asi.csv",
	// "asi1.csv",
	// "asi2.csv",
	// "easy1.csv",
	"easy2.csv",
];
const project_options = [
	{
		isQuantity: 1,
		isQuality: 0,
	},
	{
		isQuantity: 1,
		isQuality: 1,
	},
	{
		isQuantity: 0,
		isQuality: 1,
	},
	{
		isQuantity: 0,
		isQuality: 0,
	},
	{
		isQuantity: 0,
		isQuality: 1,
	},
	{
		isQuantity: 12,
		isQuality: 22,
	},
];
parsed_file = null;
container = null;
global_var_debug = {};

const parse_response_from_algo = (result) => {
	result_string = result[0];
	result_string = result_string.replace(/ /g, "");
	result_string = result_string.replace(/'/g, '"');
	result_json = JSON.parse(result_string);
	return result_json;
};

const stringToColour = (str) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let colour = "#";
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xff;
		colour += ("00" + value.toString(16)).substr(-2);
	}
	return colour;
};

const parseData = (data) => {
	try {
		let numeric_data = [];
		for (let i = 0; i < data.length; i++) {
			let numberic_object = {};
			for (let property in data[i]) {
				if (!isNaN(data[i][property])) {
					numberic_object[property] = parseFloat(data[i][property]);
				} else {
					numberic_object[property] = data[i][property];
				}
			}
			numberic_object = {
				id: i,
				...numberic_object,
				color: "",
				isIn: 0,
			};
			if (
				Object.values(numberic_object).includes(null) ||
				Object.values(numberic_object).includes(undefined)
			) {
				setCustomizedError("Problem with boxes");
				return;
			}
			numeric_data.push(numberic_object);
		}

		let container_data = {
			width: numeric_data[0]["width"],
			height: numeric_data[0]["height"],
			length: numeric_data[0]["length"],
		};

		if (
			container_data.height == null ||
			container_data.width == null ||
			container_data.length == null
		) {
			setCustomizedError("Problem with container");
			return;
		}

		let boxes = [];
		for (let i = 1; i < numeric_data.length; i++) {
			boxes.push(numeric_data[i]);
		}
		container = container_data;
		parsed_file = boxes;
	} catch (err) {
		setCustomizedError("Error pasring the file");
	}
};

const handleDrop = (file) => {
	try {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				parseData(results.data);
			},
		});
	} catch (e) {
		console.log("Error parsing");
	}
};

const checkForNegetiveMetrics = (result) => {
	// const regex = /-\d+/g;
	const regex = /-?\d+(\.\d+)?/g;

	return result.match(regex).filter((number) => parseFloat(number) < 0);
};

const runAlgo = (project_option) => {
	console.log(project_option);
	input.project_data = { ...input.project_data, ...project_option };
	global_var_debug.input = input;
	console.log(global_var_debug.input);
	// return;
	options = {
		args: [JSON.stringify(input)],
		pythonOptions: ["-u"],
	};

	PythonShell.run(scriptPath, options, function (err, result) {
		if (err) console.log(err.traceback);
		else {
			global_var_debug.result = parse_response_from_algo(result);
			result = JSON.stringify(result);
			global_var_debug.neg = checkForNegetiveMetrics(result);
			if (global_var_debug.neg.length > 0) {
				console.log(
					`found ${global_var_debug.neg} in this values:\n${global_var_debug.file}\n`
				);
				console.log(global_var_debug.input.project_data);
				console.log(global_var_debug.result);
				console.log("\n\n\n\n");
			}
		}
	});
};

const handleFile = (err, data) => {
	if (err) {
		console.error("Error reading file:", err);
		return;
	}
	handleDrop(data);
	let project_boxes = parsed_file.map((box) => {
		return { ...box, color: stringToColour(box.type), isIn: 0 };
	});

	input = {
		boxes: project_boxes,
		container: container,
		project_data: {
			name: "a",
		},
	};
	project_options.map((option) => runAlgo(option));
};

files_list.map((file) => {
	global_var_debug.file = file;
	fs.readFile(file, "utf8", (error, data) => handleFile(error, data));
});
