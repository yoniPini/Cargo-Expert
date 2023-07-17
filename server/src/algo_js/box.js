const Rotation = {
	WHL: 0,
	LHW: 1,
	HLW: 2,
	LWH: 3,
	WLH: 4,
	HWL: 5,
};

const initBox = (box) => {
	return {
		...box,
		volume: box.width * box.height * box.length,
		rotation: Rotation.WHL,
		center: {
			x: 0,
			y: 0,
			z: 0,
		},
		FLB: {
			x: 0,
			y: 0,
			z: 0,
		},
	};
};

const getSize = (box) => {
	switch (box.rotation) {
		case Rotation.WHL:
			return {
				width: box.width,
				height: box.height,
				length: box.length,
			};
		case Rotation.LHW:
			return {
				width: box.length,
				height: box.height,
				length: box.width,
			};
		case Rotation.HLW:
			return {
				width: box.height,
				height: box.length,
				length: box.width,
			};
		case Rotation.LWH:
			return {
				width: box.length,
				height: box.width,
				length: box.height,
			};
		case Rotation.WLH:
			return {
				width: box.width,
				height: box.length,
				length: box.height,
			};
		case Rotation.HWL:
			return {
				width: box.height,
				height: box.width,
				length: box.length,
			};
	}
};

const setPosition = (box, p) => {
	// set center, FLB and isIn
	const boxSize = getSize(box);

	if (p.dir == 1) {
		box.FLB = {
			x: p.x,
			y: p.y,
			z: p.z,
		};
	} else {
		box.FLB = {
			x: p.x - boxSize.width,
			y: p.y,
			z: p.z,
		};
	}

	box.center = {
		x: box.FLB.x + boxSize.width / 2,
		y: box.FLB.y + boxSize.height / 2,
		z: box.FLB.z + boxSize.length / 2,
	};
	box.isIn = 1;
};

const unsetPosition = (box) => {
	box.FLB = {
		x: 0,
		y: 0,
		z: 0,
	};

	box.center = {
		x: 0,
		y: 0,
		z: 0,
	};
	box.isIn = 0;
};

// Returns the box with the correct size.
const getBox = (box) => {
	return {
		...box,
		size: Object.values(getSize(box)),
		position: Object.values(box.center),
	};
};

module.exports = { initBox, getSize, getBox, setPosition, unsetPosition };
