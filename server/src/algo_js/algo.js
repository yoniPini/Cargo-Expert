const { initBox, setPosition, getBox } = require("./box.js");
const { getScore, updatePps } = require("./container.js");
const { rotation, perturbation } = require("./boxMotion.js");
const { orderMetric, overallMetric } = require("./metrics.js");

const ALGOIRTHM_MAX_ITERATIONS = 1000000;

const getBestPoint = (pp, box, container, solutionBoxes) => {
	let bestPoint = null;
	let bestScore = [0, 0];

	pp.forEach((p) => {
		let score = getScore(box, p, solutionBoxes, container);
		if (
			score[0] > bestScore[0] ||
			(score[0] === bestScore[0] && score[1] > bestScore[1])
		) {
			bestPoint = p;
			bestScore = score;
		}
	});

	return bestPoint;
};

const addBoxToSolution = (
	bestPoint,
	box,
	pp,
	solutionBoxes,
	solution_data,
	retryList,
	container,
	isRetry
) => {
	if (bestPoint) {
		setPosition(box, bestPoint);
		pp = updatePps(box, bestPoint, pp, container);
		solutionBoxes.push(box);
		solution_data["number_of_items"] += 1;
		solution_data["capacity"] += box.volume;
	} else {
		if (!isRetry) {
			retryList.push(box);
		} else {
			solutionBoxes.push(box);
		}
	}
};

const handleBox = (
	box,
	pp,
	container,
	solutionBoxes,
	solution_data,
	retryList,
	isRetry
) => {
	const bestPoint = getBestPoint(pp, box, container, solutionBoxes);
	addBoxToSolution(
		bestPoint,
		box,
		pp,
		solutionBoxes,
		solution_data,
		retryList,
		container,
		isRetry
	);
};

const constructivePacking = (boxes, container, isQuantity) => {
	/*
	Initialize potential points as the FLB and FRB of the container.
	Each point has a direction that indicates which corner of a box should be at the point.
	1 = FLB, -1 = FRB.
	*/
	let pp = new Set([
		{
			x: 0,
			y: 0,
			z: 0,
			dir: 1,
		},
		{
			x: container.width,
			y: 0,
			z: 0,
			dir: -1,
		},
	]);

	let solutionBoxes = [];
	let retryList = [];

	let solution_data = {
		number_of_items: 0,
		capacity: 0,
		order_score: 0,
		overall_score: 0,
	};

	// For each box, put it in the best point possible.
	boxes.forEach((box) => {
		handleBox(
			box,
			pp,
			container,
			solutionBoxes,
			solution_data,
			retryList,
			false
		);
	});

	// For each box which is not put in the solution, try and put it again.
	retryList.forEach((box) => {
		handleBox(
			box,
			pp,
			container,
			solutionBoxes,
			solution_data,
			retryList,
			true
		);
	});

	solution_data.order_score = parseFloat(
		orderMetric(solutionBoxes, container)
	);
	solution_data.overall_score = parseFloat(
		overallMetric(boxes, container, solution_data, isQuantity)
	);
	return [solutionBoxes, solution_data];
};

const handleData = (data) => {
	const isQuality = data.project_data.isQuality;
	const algorithmTime = isQuality ? 60000 : 15000; // miliseconds
	const isQuantity = data.project_data.isQuantity;
	const container = data.container;
	const boxes = data.boxes;

	const initBoxes = boxes.map((box) => {
		return initBox(box);
	});

	// Sort the boxes by descending order by the "order" property.
	initBoxes.sort((a, b) => (a.order > b.order ? -1 : 1));
	return [initBoxes, container, isQuantity, algorithmTime];
};

const getSolutions = (algorithmTime, boxes, container, isQuantity) => {
	let solutionList = {};
	let counter = 0;
	const endTime = Date.now() + algorithmTime;
	while (Date.now() < endTime) {
		let boxesCopy = [...boxes];
		// For non-deterministic algorithm - rotating and perturbating the boxes.
		boxesCopy = rotation(boxesCopy);
		boxesCopy = perturbation(boxesCopy);
		let solution = constructivePacking(boxesCopy, container, isQuantity);
		if (solution === null) {
			continue;
		}
		let [boxesInSolution, solution_data] = solution;
		if (boxesInSolution !== null && solution_data !== null) {
			let counterString = counter.toString();
			solutionList[counterString] = {
				name: "solution " + counterString,
				id: counter,
				boxes: boxesInSolution.map((box) => {
					return getBox(box);
				}),
				solution_data: solution_data,
			};
			counter += 1;
		}
		if (counter === ALGOIRTHM_MAX_ITERATIONS) {
			break;
		}
	}

	return solutionList;
};

const sortByPreference = (solutionList, isQuantity) => {
	if (isQuantity) {
		solutionList = Object.values(solutionList)
			.sort(
				(a, b) =>
					b.solution_data.number_of_items -
					a.solution_data.number_of_items
			)
			.slice(0, 50);
		solutionList = solutionList
			.sort((a, b) => b.solution_data.capacity - a.solution_data.capacity)
			.slice(0, 25);
		solutionList = solutionList
			.sort(
				(a, b) =>
					b.solution_data.order_score - a.solution_data.order_score
			)
			.slice(0, 10);
	} else {
		solutionList = Object.values(solutionList)
			.sort(
				(a, b) =>
					b.solution_data.order_score - a.solution_data.order_score
			)
			.slice(0, 20);
		solutionList = solutionList
			.sort(
				(a, b) =>
					b.solution_data.number_of_items -
					a.solution_data.number_of_items
			)
			.slice(0, 15);
		solutionList = solutionList
			.sort((a, b) => b.solution_data.capacity - a.solution_data.capacity)
			.slice(0, 10);
	}
	solutionList = solutionList.sort(
		(a, b) => b.solution_data.overall_score - a.solution_data.overall_score
	);
	return solutionList;
};

const dictSolutionsFromList = (solutionList) => {
	let solutionDict = {};
	for (let index = 0; index < solutionList.length; index++) {
		let indexString = index.toString();
		solutionDict[indexString] = solutionList[index];
	}
	return solutionDict;
};

const algo = (data) => {
	const [boxes, container, isQuantity, algorithmTime] = handleData(data);
	let solutionList = getSolutions(
		algorithmTime,
		boxes,
		container,
		isQuantity
	);

	solutionList = sortByPreference(solutionList, isQuantity);

	solutionList = solutionList.map((solution, index) => {
		return { ...solution, name: `solution ${index + 1}` };
	});

	let solutionDict = dictSolutionsFromList(solutionList);

	return solutionDict;
};

module.exports = { algo, handleBox };
