const mongoose = require("mongoose");

const EMAIL_VALIDATION_ERROR = "Email should be a valid email address";

const BoxSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	order: { type: Number, required: true },
	position: { type: [Number], required: true },
	type: { type: String, required: true },
	color: { type: String, required: true },
	size: { type: [Number], required: true },
	isIn: { type: Number, required: true },
});

const SolutionDataSchema = new mongoose.Schema({
	capacity: { type: Number, required: true },
	number_of_items: { type: Number, required: true },
	order_score: { type: Number, required: true },
	overall_score: { type: Number, required: true },
});

const SolutionSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	boxes: { type: [BoxSchema], required: true },
	name: { type: String, required: true },
	solution_data: { type: SolutionDataSchema, required: true },
});

const ProjectDataSchema = new mongoose.Schema({
	name: { type: String, required: true },
	isQuantity: { type: Number, required: true },
	isQuality: { type: Number, required: true },
});

const ProjectSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	container: { type: [Number], required: true },
	project_data: { type: ProjectDataSchema, required: true },
	boxes: { type: [BoxSchema], required: true },
	solutions: { type: [SolutionSchema], required: true },
});

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: [
			{
				validator: (email) => {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					return emailRegex.test(email);
				},
				message: EMAIL_VALIDATION_ERROR,
			},
		],
	},
	password: {
		type: String,
		required: true,
	},
	projects: { type: [ProjectSchema], required: true },
});

const User = mongoose.model("User", UserSchema);
const Project = mongoose.model("Project", ProjectSchema);
const Box = mongoose.model("Box", BoxSchema);
const Solution = mongoose.model("Solution", SolutionSchema);

module.exports = { User, Project, Box, Solution };
