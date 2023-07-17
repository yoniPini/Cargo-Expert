const Papa = require("papaparse");
const path = require("path");
const fs = require("fs");
const { algo } = require("../../algo_js/algo.js");

const scriptPath = path.join(__dirname, "../../algo_js/algo.py");
const files_list = [
	"asi.csv",
	"big_numbers_little_boxes.csv",
	"big_numbers_many_boxes.csv",
	"boxes_variety_little_boxes.csv",
	"boxes_variety_many_boxes.csv",
	"container_big.csv",
	"container_small.csv",
	"easy1.csv",
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
];
parsed_file = null;
container = null;
global_var_debug = {};

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
	const regex = /-?\d+(\.\d+)?/g;
	return result.match(regex).filter((number) => parseFloat(number) < 0);
};

const runAlgo = (project_option) => {
	input.project_data = { ...input.project_data, ...project_option };
	global_var_debug.input = input;
	// console.log(global_var_debug.input.project_data);

	const solutions = algo(input);
	global_var_debug.solutions = solutions;
	// return;
	result = JSON.stringify(solutions);
	global_var_debug.neg = checkForNegetiveMetrics(result);
	if (global_var_debug.neg.length > 0) {
		console.log(
			`found ${global_var_debug.neg} in this values:\n${global_var_debug.file}\n`
		);
		console.log(global_var_debug.input.project_data);
		console.log(global_var_debug.solutions);
		console.log("\n\n\n\n");
	}
};

const handleFile = (data) => {
	// console.log(data);
	handleDrop(data);
	let project_boxes = parsed_file.map((box) => {
		return { ...box, color: stringToColour(box.type), isIn: 0 };
	});

	input = {
		boxes: project_boxes,
		container: container,
		project_data: {
			name: global_var_debug.file,
		},
	};
	project_options.map((option) => runAlgo(option));
};

console.log("js algorithm");
files_list.forEach((file) => {
	global_var_debug.file = file;
	data = fs.readFileSync(file, "utf8");
	// console.log(data);
	handleFile(data);
});
