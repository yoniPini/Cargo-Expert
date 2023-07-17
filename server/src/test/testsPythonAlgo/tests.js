//  tests 1-7 are tested with no randomness in algo.py
const test_1 = {
	container: { width: 3, height: 1, length: 1 },
	boxes: [
		{
			order: 1,
			type: "Box1",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
		},

		{
			order: 2,
			type: "Box2",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
		},

		{
			order: 3,
			type: "Box3",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
		},
	],
};

const test_2 = {
	container: { width: 1, height: 3, length: 1 },
	boxes: [
		{ order: 1, type: "Box1", width: 1, height: 1, length: 1 },

		{ order: 2, type: "Box2", width: 1, height: 1, length: 1 },

		{ order: 3, type: "Box3", width: 1, height: 1, length: 1 },
	],
};

const test_3 = {
	container: { width: 1, height: 1, length: 3 },
	boxes: [
		{ order: 1, type: "Box1", width: 1, height: 1, length: 1 },

		{ order: 2, type: "Box2", width: 1, height: 1, length: 1 },

		{ order: 3, type: "Box3", width: 1, height: 1, length: 1 },
	],
};

const test_4 = {
	container: { width: 2, height: 2, length: 2 },
	boxes: [{ order: 1, type: "Box1", width: 2, height: 2, length: 2 }],
};

const test_5 = {
	container: { width: 4, height: 2, length: 2 },
	boxes: [
		{ order: 1, type: "Box1", width: 2, height: 2, length: 2 },
		{ order: 2, type: "Box2", width: 2, height: 2, length: 2 },
	],
};

const test_6 = {
	container: { width: 6, height: 1, length: 6 },
	boxes: [
		{ order: 1, type: "Box1", width: 2, height: 1, length: 2 },
		{ order: 2, type: "Box2", width: 2, height: 1, length: 2 },
		{ order: 3, type: "Box3", width: 2, height: 1, length: 2 },
		{ order: 4, type: "Box4", width: 2, height: 1, length: 2 },
		{ order: 5, type: "Box5", width: 2, height: 1, length: 2 },
		{ order: 6, type: "Box6", width: 2, height: 1, length: 2 },
		{ order: 7, type: "Box7", width: 2, height: 1, length: 2 },
		{ order: 8, type: "Box8", width: 2, height: 1, length: 2 },
		{ order: 9, type: "Box9", width: 2, height: 1, length: 2 },
	],
};

const test_7 = {
	container: { width: 4, height: 4, length: 4 },
	boxes: [
		{ order: 1, type: "Box1", width: 2, height: 2, length: 2 },
		{ order: 2, type: "Box2", width: 2, height: 2, length: 2 },
		{ order: 3, type: "Box3", width: 2, height: 2, length: 2 },
		{ order: 4, type: "Box4", width: 2, height: 2, length: 2 },
		{ order: 5, type: "Box5", width: 2, height: 2, length: 2 },
		{ order: 6, type: "Box6", width: 2, height: 2, length: 2 },
		{ order: 7, type: "Box7", width: 2, height: 2, length: 2 },
		{ order: 8, type: "Box8", width: 2, height: 2, length: 2 },
	],
};

// answers for tests 1-7
const answers = [
	"[([1 (0, 0, 0), 2 (2, 0, 0), 3 (1, 0, 0)], {'number_of_items': 3, 'capacity': 3})]",
	"[([1 (0, 0, 0), 2 (0, 1, 0), 3 (0, 2, 0)], {'number_of_items': 3, 'capacity': 3})]",
	"[([1 (0, 0, 0), 2 (0, 0, 1), 3 (0, 0, 2)], {'number_of_items': 3, 'capacity': 3})]",
	"[([1 (0, 0, 0)], {'number_of_items': 1, 'capacity': 8})]",
	"[([1 (0, 0, 0), 2 (2, 0, 0)], {'number_of_items': 2, 'capacity': 16})]",
	"[([1 (0, 0, 0), 2 (4, 0, 0), 3 (2, 0, 0), 4 (0, 0, 2), 5 (4, 0, 2), 6 (2, 0, 2), 7 (4, 0, 4), 8 (0, 0, 4), 9 (2, 0, 4)], {'number_of_items': 9, 'capacity': 36})]",
	"[([1 (0, 0, 0), 2 (2, 0, 0), 3 (2, 2, 0), 4 (0, 2, 0), 5 (0, 0, 2), 6 (2, 0, 2), 7 (0, 2, 2), 8 (2, 2, 2)], {'number_of_items': 8, 'capacity': 64})]",
];

const test_8 = {
	container: { width: 4, height: 12, length: 8 },
	boxes: [
		{
			order: 1,
			type: "Box1",
			width: 1,
			height: 4,
			length: 4,
			color: "gray",
		},
		{
			order: 2,
			type: "Box2",
			width: 2,
			height: 4,
			length: 2,
			color: "gray",
		},
		{
			order: 3,
			type: "Box3",
			width: 1,
			height: 4,
			length: 4,
			color: "gray",
		},
		{
			order: 4,
			type: "Box4",
			width: 2,
			height: 4,
			length: 2,
			color: "gray",
		},
		{
			order: 5,
			type: "Box5",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 6,
			type: "Box6",
			width: 2,
			height: 4,
			length: 2,
			color: "gray",
		},
		{
			order: 7,
			type: "Box7",
			width: 2,
			height: 4,
			length: 2,
			color: "gray",
		},
		{
			order: 8,
			type: "Box8",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 9,
			type: "Box9",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 10,
			type: "Box01",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 11,
			type: "Box11",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 12,
			type: "Box12",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 13,
			type: "Box13",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 14,
			type: "Box14",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 15,
			type: "Box15",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
		{
			order: 16,
			type: "Box16",
			width: 2,
			height: 4,
			length: 2,
			color: "light-gray",
		},
	],
};

const test_9 = {
	container: { width: 3, height: 1, length: 1 },
	boxes: [
		{
			order: 1,
			type: "Box1",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
			size: [1, 1, 1],
			position: [1, 1, 1],
		},

		{
			order: 2,
			type: "Box2",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
			size: [1, 1, 1],
			position: [1, 2, 1],
		},

		{
			order: 3,
			type: "Box3",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
			size: [1, 1, 1],
			position: [2, 1, 1],
		},
	],
};

const test_10 = {
	container: { width: 3, height: 1, length: 1 },
	boxes: [
		{
			id: 1,
			text: "Box1",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
			size: [1, 1, 1],
			position: [1, 1, 1],
		},

		{
			id: 2,
			text: "Box2",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
			size: [1, 1, 1],
			position: [1, 2, 1],
		},

		{
			id: 3,
			text: "Box3",
			width: 1,
			height: 1,
			length: 1,
			color: "gray",
			size: [1, 1, 1],
			position: [2, 1, 1],
		},
	],
};

const test_11 = {
	container: { width: 3, height: 1, length: 1 },
	boxes: [
		{
			order: 1,
			type: "Box1",
			size: [1, 1, 1],
			position: [1, 1, 1],
		},
	],
};
