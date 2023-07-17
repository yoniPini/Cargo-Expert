import {
	numOfItemsMetric,
	volumeMetric,
	orderMetric,
	overallMetric,
	normalize,
} from "./metrics";

/* ~~~~~~~~~~~~~~~~~~~ numOfItems Metric ~~~~~~~~~~~~~~~~~~~ */

describe("numOfItemsMetric", () => {
	test("returns 0 for undefined solutionBoxes", () => {
		const solutionBoxes = undefined;
		const result = numOfItemsMetric(solutionBoxes);
		expect(result).toBe(0);
	});

	test("returns 0 for null solutionBoxes", () => {
		const solutionBoxes = null;
		const result = numOfItemsMetric(solutionBoxes);
		expect(result).toBe(0);
	});

	test('returns 0 for solutionBoxes with no "isIn" boxes', () => {
		const solutionBoxes = [
			{ isInside: 1 },
			{ isInside: 0 },
			{ isInside: 0 },
		];
		const result = numOfItemsMetric(solutionBoxes);
		expect(result).toBe(0);
	});

	test("returns 0 for solutionBoxes with no boxes at all", () => {
		const solutionBoxes = [];
		const result = numOfItemsMetric(solutionBoxes);
		expect(result).toBe(0);
	});

	test('returns the count of boxes marked as "isIn"', () => {
		const solutionBoxes = [
			{ isIn: 1 },
			{ isIn: 0 },
			{ isIn: 1 },
			{ isIn: 1 },
		];
		const result = numOfItemsMetric(solutionBoxes);
		expect(result).toBe(3);
	});

	test('returns the correct count when some boxes are not marked as "isIn"', () => {
		const solutionBoxes = [
			{ isIn: 1 },
			{ isIn: 0 },
			{ isIn: 0 },
			{ isIn: 1 },
			{ isIn: 1 },
			{ isIn: 0 },
		];
		const result = numOfItemsMetric(solutionBoxes);
		expect(result).toBe(3);
	});
});

/* ~~~~~~~~~~~~~~~~~~~ Volume Metric ~~~~~~~~~~~~~~~~~~~ */

describe("volumeMetric", () => {
	test("returns 0 for undefined solutionBoxes", () => {
		const solutionBoxes = undefined;
		const result = volumeMetric(solutionBoxes);
		expect(result).toBe(0);
	});

	test("returns 0 for null solutionBoxes", () => {
		const solutionBoxes = null;
		const result = volumeMetric(solutionBoxes);
		expect(result).toBe(0);
	});

	test('returns 0 for solutionBoxes with no "isIn" boxes', () => {
		const solutionBoxes = [
			{ isInside: 1, size: [2, 3, 4] },
			{ isInside: 0, size: [1, 2, 3] },
			{ isInside: 0, size: [3, 4, 5] },
		];
		const result = volumeMetric(solutionBoxes);
		expect(result).toBe(0);
	});

	test("returns 0 for solutionBoxes with no boxes at all", () => {
		const solutionBoxes = [];
		const result = volumeMetric(solutionBoxes);
		expect(result).toBe(0);
	});

	test('returns the sum of volumes for boxes marked as "isIn"', () => {
		const solutionBoxes = [
			{ isIn: 1, size: [2, 3, 4] },
			{ isIn: 0, size: [1, 2, 3] },
			{ isIn: 1, size: [3, 4, 5] },
			{ isIn: 1, size: [1, 1, 1] },
		];
		const result = volumeMetric(solutionBoxes);
		expect(result).toBe(85); // 2x3x4 + 3x4x5 + 1x1x1 = 24 + 60 + 1 = 85
	});

	test("returns 0 if some boxes have invalid sizes", () => {
		const solutionBoxes = [
			{ isIn: 1, size: [2, 3, 4] },
			{ isIn: 1, size: [1, -2, 3] },
			{ isIn: 1, size: [3, 4, 5] },
			{ isIn: 1, size: [1, 1, 1] },
		];
		const result = volumeMetric(solutionBoxes);
		expect(result).toBe(0);
	});
});

/* ~~~~~~~~~~~~~~~~~~~ Order Metric ~~~~~~~~~~~~~~~~~~~ */

describe("orderMetric", () => {
	test("returns 0 for undefined solutionBoxes", () => {
		const solutionBoxes = undefined;
		const container = [{ length: 10 }];
		const result = orderMetric(solutionBoxes, container);
		expect(result).toBe(0);
	});

	test("returns 0 for undefined container", () => {
		const solutionBoxes = [{ isIn: true }];
		const container = undefined;
		const result = orderMetric(solutionBoxes, container);
		expect(result).toBe(0);
	});

	test("returns 0 for empty solutionBoxes", () => {
		const solutionBoxes = [];
		const container = [{ length: 10 }];
		const result = orderMetric(solutionBoxes, container);
		expect(result).toBe(0);
	});

	test("returns 0 for empty container", () => {
		const solutionBoxes = [{ isIn: true }];
		const container = [];
		const result = orderMetric(solutionBoxes, container);
		expect(result).toBe(0);
	});

	test("returns 0 when no inBoxes are present", () => {
		const solutionBoxes = [
			{ isIn: 0, order: 2, position: [0, 0, 0], size: [1, 1, 1] },
			{ isIn: 0, order: 1, position: [0, 0, 0], size: [1, 1, 1] },
		];
		const container = [{ length: 10 }];
		const result = orderMetric(solutionBoxes, container);
		expect(result).toBe(0);
	});

	test("returns a correct order metric score", () => {
		const solutionBoxes = [
			{
				isIn: 1,
				order: 3,
				position: [0.5, 0.5, 1.5],
				size: [1, 1, 1],
			},
			{
				isIn: 1,
				order: 2,
				position: [0.5, 0.5, 2.5],
				size: [1, 1, 1],
			},
			{
				isIn: 1,
				order: 1,
				position: [0.5, 0.5, 3.5],
				size: [1, 1, 1],
			},
		];
		const container = { length: 10 };
		const result = orderMetric(solutionBoxes, container);
		const isValid = result >= 0 && result <= 100;
		expect(isValid).toBe(true);
	});
});

/* ~~~~~~~~~~~~~~~~~~~ normalize ~~~~~~~~~~~~~~~~~~~ */

describe("normalize", () => {
	test("returns an empty array for undefined numbers", () => {
		const numbers = undefined;
		const result = normalize(numbers);
		expect(result).toEqual([]);
	});

	test("returns an empty array for null numbers", () => {
		const numbers = null;
		const result = normalize(numbers);
		expect(result).toEqual([]);
	});

	test("returns an empty array for an empty numbers array", () => {
		const numbers = [];
		const result = normalize(numbers);
		expect(result).toEqual([]);
	});

	test("returns an array of 1s when all numbers are the same", () => {
		const numbers = [5, 5, 5, 5, 5];
		const result = normalize(numbers);
		expect(result).toEqual([1, 1, 1, 1, 1]);
	});

	test("returns the normalized values for a range of numbers", () => {
		const numbers = [2, 4, 6, 8, 10];
		const result = normalize(numbers);
		expect(result).toEqual([0, 0.25, 0.5, 0.75, 1]);
	});

	test("returns the normalized values for a range of negative numbers", () => {
		const numbers = [-10, -5, 0, 5, 10];
		const result = normalize(numbers);
		expect(result).toEqual([0, 0.25, 0.5, 0.75, 1]);
	});

	test("handles duplicate maximum and minimum numbers", () => {
		const numbers = [2, 2, 2, 2, 2];
		const result = normalize(numbers);
		expect(result).toEqual([1, 1, 1, 1, 1]);
	});

	test("handles negative numbers with a range including zero", () => {
		const numbers = [-10, -5, 0, 5, 10];
		const result = normalize(numbers);
		expect(result).toEqual([0, 0.25, 0.5, 0.75, 1]);
	});

	test("handles negative numbers with a range excluding zero", () => {
		const numbers = [-10, -5, 5, 10];
		const result = normalize(numbers);
		expect(result).toEqual([0, 0.25, 0.75, 1]);
	});

	test("handles decimal numbers", () => {
		const numbers = [1.5, 2.5, 3.5, 4.5, 5.5];
		const result = normalize(numbers);
		expect(result).toEqual([0, 0.25, 0.5, 0.75, 1]);
	});
});

/* ~~~~~~~~~~~~~~~~~~~ Overall Metric ~~~~~~~~~~~~~~~~~~~ */

describe("overallMetric", () => {
	test("returns 0 for undefined projectBoxes", () => {
		const projectBoxes = undefined;
		const container = [10, 10, 10];
		const solution_data = {
			number_of_items: 5,
			capacity: 100,
			order_score: 80,
		};
		const isQuantity = 0;
		const result = overallMetric(
			projectBoxes,
			container,
			solution_data,
			isQuantity
		);
		expect(result).toBe(0);
	});

	test("returns 0 for undefined container", () => {
		const projectBoxes = [{ size: [1, 1, 1] }];
		const container = undefined;
		const solution_data = {
			number_of_items: 5,
			capacity: 100,
			order_score: 80,
		};
		const isQuantity = 0;
		const result = overallMetric(
			projectBoxes,
			container,
			solution_data,
			isQuantity
		);
		expect(result).toBe(0);
	});

	test("returns 0 for container with incorrect dimensions", () => {
		const projectBoxes = [{ size: [1, 1, 1] }];
		const container = [10, 10];
		const solution_data = {
			number_of_items: 5,
			capacity: 100,
			order_score: 80,
		};
		const isQuantity = false;
		const result = overallMetric(
			projectBoxes,
			container,
			solution_data,
			isQuantity
		);
		expect(result).toBe(0);
	});

	test("returns 0 for undefined solution_data", () => {
		const projectBoxes = [{ size: [1, 1, 1] }];
		const container = [10, 10, 10];
		const solution_data = undefined;
		const isQuantity = 0;
		const result = overallMetric(
			projectBoxes,
			container,
			solution_data,
			isQuantity
		);
		expect(result).toBe(0);
	});
});
