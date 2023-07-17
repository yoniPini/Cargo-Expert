const { getSize } = require("./box.js");

const Rotation = {
	WHL: 0,
	LHW: 1,
	HLW: 2,
	LWH: 3,
	WLH: 4,
	HWL: 5,
};

const rotateEachBox = (boxes) => {
	const numOfRotations = Object.values(Rotation).length;
	const rotationsList = Object.values(Rotation);
	return boxes.map((box) => {
		const rotation =
			rotationsList[Math.floor(Math.random() * numOfRotations)];
		return { ...box, rotation: rotation };
	});
};

const rotateSubset = (boxes) => {
	/*
    For each subset of items sharing all dimensions,
    randomly pick one of the orientations that with equal probability.
    */

	// Group boxes by size
	const sameSizeDict = boxes.reduce((dict, box) => {
		const boxSizeString = JSON.stringify(getSize(box));
		if (!dict[boxSizeString]) {
			dict[boxSizeString] = [];
		}
		dict[boxSizeString].push(box);
		return dict;
	}, {});

	// Generate random rotation for each size
	const numOfRotations = Object.values(Rotation).length;
	const rotationsList = Object.values(Rotation);
	const rotations = Object.keys(sameSizeDict).reduce((acc, size) => {
		if (!acc[size]) {
			const rotationIndex = Math.floor(Math.random() * numOfRotations);
			const rotation = rotationsList[rotationIndex];
			acc[size] = rotation;
		}
		return acc;
	}, {});

	// Assign rotation to boxes
	return boxes.map((box) => {
		const boxSizeString = JSON.stringify(getSize(box));
		const rotation = rotations[boxSizeString];
		return { ...box, rotation: rotation };
	});
};

const rotation = (boxes) => {
	// Rotate boxes individually or by subset with equal probability
	if (boxes.length) {
		return Math.random() < 0.5 ? rotateEachBox(boxes) : rotateSubset(boxes);
	} else {
		return [];
	}
};

const volumePerturb = (b1, b2) => {
	if (
		0.7 <= b1.volume / b2.volume &&
		b1.volume / b2.volume <= 1.3 &&
		Math.random() > 0.5
	) {
		return true;
	}
	return false;
};

const perturbation = (boxes) => {
	if (boxes.length <= 1) {
		return boxes;
	}
	for (let i = 0; i < boxes.length - 1; i++) {
		if (volumePerturb(boxes[i], boxes[i + 1])) {
			[boxes[i], boxes[i + 1]] = [boxes[i + 1], boxes[i]];
		}
	}

	return boxes;
};

module.exports = { Rotation, rotation, perturbation };
