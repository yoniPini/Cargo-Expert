// returns true if there is a box that is out of bounds
// return false if everything is ok
const isBoxesOutOfBounds = (inBoxes, container) => {
	if (!inBoxes || !container || container.length !== 3) {
		return true;
	}

	const isOutOfBounds = inBoxes.some((box) => {
		const x_condiction =
			box.position[0] + 0.5 * box.size[0] > container[0] ||
			box.position[0] - 0.5 * box.size[0] < 0;
		const y_condiction =
			box.position[1] + 0.5 * box.size[1] > container[1] ||
			box.position[1] - 0.5 * box.size[1] < 0;
		const z_condiction =
			box.position[2] + 0.5 * box.size[2] > container[2] ||
			box.position[2] - 0.5 * box.size[2] < 0;
		return x_condiction || y_condiction || z_condiction;
	});
	return isOutOfBounds;
};

// return true if two boxes are overlapping
const isTwoBoxesOverLapping = (box1, box2) => {
	if (!box1 || !box2) {
		return true;
	}

	const box1xMin = box1.position[0] - box1.size[0] / 2;
	const box1xMax = box1.position[0] + box1.size[0] / 2;
	const box2xMin = box2.position[0] - box2.size[0] / 2;
	const box2xMax = box2.position[0] + box2.size[0] / 2;

	// Check if boxes are separated along x axis
	if (box1xMax <= box2xMin || box2xMax <= box1xMin) {
		return false;
	}

	const box1yMin = box1.position[1] - box1.size[1] / 2;
	const box1yMax = box1.position[1] + box1.size[1] / 2;
	const box2yMin = box2.position[1] - box2.size[1] / 2;
	const box2yMax = box2.position[1] + box2.size[1] / 2;

	if (box1yMax <= box2yMin || box2yMax <= box1yMin) {
		return false;
	}

	const box1zMin = box1.position[2] - box1.size[2] / 2;
	const box1zMax = box1.position[2] + box1.size[2] / 2;
	const box2zMin = box2.position[2] - box2.size[2] / 2;
	const box2zMax = box2.position[2] + box2.size[2] / 2;

	if (box1zMax <= box2zMin || box2zMax <= box1zMin) {
		return false;
	}

	// If boxes are not separated along any axis, they must be overlapping
	return true;
};

// returns true if everything is ok
const isBoxesOverlapping = (inBoxes) => {
	for (let i = 0; i < inBoxes.length; i++) {
		for (let j = i + 1; j < inBoxes.length; j++) {
			if (isTwoBoxesOverLapping(inBoxes[i], inBoxes[j])) {
				return true;
			}
		}
	}
	return false;
};

const isBoxesHovering = (inBoxes) => {
	const getXs = (box, otherBox, i) => {
		const boxMin = box.flb.x;
		const boxMax = box.flb.x + box.size[i];
		const otherBoxMin = otherBox.flb.x;
		const otherBoxMax = otherBox.flb.x + otherBox.size[i];

		// Check if boxes are separated along x axis
		if (boxMax <= otherBoxMin || otherBoxMax <= boxMin) {
			return 0;
		}

		let min;
		if (boxMin <= otherBoxMin) {
			min = otherBoxMin;
		} else {
			min = boxMin;
		}

		let max;
		if (boxMax >= otherBoxMax) {
			max = otherBoxMax;
		} else {
			max = boxMax;
		}
		return max - min;
	};

	const getZs = (box, otherBox, i) => {
		const boxMin = box.flb.z;
		const boxMax = box.flb.z + box.size[i];
		const otherBoxMin = otherBox.flb.z;
		const otherBoxMax = otherBox.flb.z + otherBox.size[i];

		// Check if boxes are separated along x axis
		if (boxMax <= otherBoxMin || otherBoxMax <= boxMin) {
			return 0;
		}

		let min;
		if (boxMin <= otherBoxMin) {
			min = otherBoxMin;
		} else {
			min = boxMin;
		}

		let max;
		if (boxMax >= otherBoxMax) {
			max = otherBoxMax;
		} else {
			max = boxMax;
		}
		return max - min;
	};

	const getCoverage = (box, otherBox) => {
		if (box.flb.y !== otherBox.flb.y + otherBox.size[1]) {
			return 0;
		}

		let x_intersection = getXs(box, otherBox, 0);
		let z_intersection = getZs(box, otherBox, 2);

		return x_intersection * z_intersection;
	};

	const boxes_with_flb = inBoxes.map((box) => {
		let flb = {
			x: box.position[0] - box.size[0] / 2,
			y: box.position[1] - box.size[1] / 2,
			z: box.position[2] - box.size[2] / 2,
		};
		return { ...box, flb: flb };
	});

	for (let i = 0; i < boxes_with_flb.length; i++) {
		const box = boxes_with_flb[i];
		if (box.flb.y === 0) {
			continue;
		}
		let overall_coverage = 0;
		const area = box.size[0] * box.size[2];
		for (let j = 0; j < boxes_with_flb.length; j++) {
			if (j === i) {
				continue;
			}
			const otherBox = boxes_with_flb[j];
			let current_coverage = getCoverage(box, otherBox);
			overall_coverage += current_coverage;
		}
		if (overall_coverage !== area) {
			return true;
		}
	}
	return false;
};

module.exports = {
	isBoxesOutOfBounds,
	isBoxesOverlapping,
	isTwoBoxesOverLapping,
	isBoxesHovering,
};
