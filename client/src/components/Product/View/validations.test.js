import {
	isBoxesOutOfBounds,
	isTwoBoxesOverLapping,
	isBoxesHovering,
} from "./validations";

/* ~~~~~~~~~~~~~~~~~~~ isBoxesOutOfBounds ~~~~~~~~~~~~~~~~~~~ */

describe("isBoxesOutOfBounds", () => {
	test("returns false for empty inBoxes array", () => {
		const inBoxes = [];
		const container = [10, 10, 10];
		const result = isBoxesOutOfBounds(inBoxes, container);
		expect(result).toBe(false);
	});

	test("returns true for undefined inBoxes", () => {
		const inBoxes = undefined;
		const container = [10, 10, 10];
		const result = isBoxesOutOfBounds(inBoxes, container);
		expect(result).toBe(true);
	});

	test("returns true for undefined container", () => {
		const inBoxes = [{ position: [2, 2, 2], size: [1, 1, 1] }];
		const container = undefined;
		const result = isBoxesOutOfBounds(inBoxes, container);
		expect(result).toBe(true);
	});

	test("returns true for out-bounds boxes", () => {
		const inBoxes = [
			{ position: [0.5, 0.5, 0.5], size: [1, 1, 1] },
			{ position: [1.5, 0.5, 0.5], size: [1, 1, 1] },
		];
		const container = [1, 1, 1];
		const result = isBoxesOutOfBounds(inBoxes, container);
		expect(result).toBe(true);
	});

	test("returns false for in-bounds boxes", () => {
		const inBoxes = [
			{ position: [0.5, 0.5, 0.5], size: [1, 1, 1] },
			{ position: [1.5, 0.5, 0.5], size: [1, 1, 1] },
		];
		const container = [2, 1, 1];
		const result = isBoxesOutOfBounds(inBoxes, container);
		expect(result).toBe(false);
	});
});

/* ~~~~~~~~~~~~~~~~~~~ isBoxesOverlapping ~~~~~~~~~~~~~~~~~~~ */

describe("isTwoBoxesOverLapping", () => {
	test("returns true for overlapping boxes", () => {
		const box1 = { position: [2, 2, 2], size: [2, 2, 2] };
		const box2 = { position: [3, 3, 3], size: [2, 2, 2] };
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(true);
	});

	test("returns false for non-overlapping boxes", () => {
		const box1 = { position: [2, 2, 2], size: [2, 2, 2] };
		const box2 = { position: [6, 6, 6], size: [2, 2, 2] };
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(false);
	});

	test("returns true for partially overlapping boxes", () => {
		const box1 = { position: [2, 2, 2], size: [2, 2, 2] };
		const box2 = { position: [3, 3, 3], size: [4, 4, 4] };
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(true);
	});

	test("returns true for identical boxes", () => {
		const box1 = { position: [2, 2, 2], size: [2, 2, 2] };
		const box2 = { position: [2, 2, 2], size: [2, 2, 2] };
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(true);
	});

	test("returns false for boxes with zero size at the same position", () => {
		const box1 = { position: [2, 2, 2], size: [0, 0, 0] };
		const box2 = { position: [2, 2, 2], size: [0, 0, 0] };
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(false);
	});

	test("returns false for boxes with zero size at different positions", () => {
		const box1 = { position: [2, 2, 2], size: [0, 0, 0] };
		const box2 = { position: [3, 3, 3], size: [0, 0, 0] };
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(false);
	});

	test("returns true for undefined box1", () => {
		const box1 = undefined;
		const box2 = { position: [2, 2, 2], size: [2, 2, 2] };
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(true);
	});

	test("returns true for undefined box2", () => {
		const box1 = { position: [2, 2, 2], size: [2, 2, 2] };
		const box2 = undefined;
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(true);
	});

	test("returns true for undefined box1 and box2", () => {
		const box1 = undefined;
		const box2 = undefined;
		const result = isTwoBoxesOverLapping(box1, box2);
		expect(result).toBe(true);
	});
});

/* ~~~~~~~~~~~~~~~~~~~ isBoxesHovering ~~~~~~~~~~~~~~~~~~~ */

describe("isBoxesHovering", () => {
	test("returns false for non-hovering boxes", () => {
		const inBoxes = [
			{ position: [1, 1, 1], size: [2, 2, 2] },
			{ position: [2, 1, 1], size: [2, 2, 2] },
			{ position: [3, 1, 1], size: [2, 2, 2] },
		];
		const result = isBoxesHovering(inBoxes);
		expect(result).toBe(false);
	});

	test("returns true for hovering boxes", () => {
		const inBoxes = [
			{ position: [1, 1, 1], size: [2, 2, 2] },
			{ position: [2, 3, 1], size: [2, 2, 2] },
			{ position: [5, 5, 5], size: [2, 2, 2] },
			{ position: [8, 8, 8], size: [2, 2, 2] },
		];
		const result = isBoxesHovering(inBoxes);
		expect(result).toBe(true);
	});

	test("returns false for empty boxes array", () => {
		const inBoxes = [];
		const result = isBoxesHovering(inBoxes);
		expect(result).toBe(false);
	});

	test("returns false for boxes with y = 0", () => {
		const inBoxes = [
			{ position: [1, 1, 1], size: [2, 2, 2] },
			{ position: [5, 1, 5], size: [2, 2, 2] },
			{ position: [9, 1, 9], size: [2, 2, 2] },
		];
		const result = isBoxesHovering(inBoxes);
		expect(result).toBe(false);
	});
});
