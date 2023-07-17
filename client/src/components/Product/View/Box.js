import { useRef, useState, useEffect } from "react";
import { useHelper } from "@react-three/drei";
import { BoxHelper } from "three";
import { useProject } from "../ProjectProvider.js";
import { BoxText } from "./BoxText.js";
import { useEdit } from "./EditProvider.js";

export const Box = ({ id, order, size, position, color, type, isIn }) => {
	const { changeBoxById, changeBoxIndices, solutionId, boxIndices } =
		useProject();
	const { edit } = useEdit();
	const [boxColor, setBoxColor] = useState(color);
	const eps = 0.0001;
	const [w, h, l] = size;
	const [x, y, z] = position;
	const mesh = useRef();
	const outlineColor = "#303030";
	const boxEditColor = "#FF6C6C";
	useHelper(mesh, BoxHelper, outlineColor);

	useEffect(() => {
		setBoxColor(color);
	}, [solutionId, color]);

	useEffect(() => {
		if (!boxIndices.includes(id)) {
			setBoxColor(color);
		}
	}, [boxIndices, color, setBoxColor, id]);

	const boxTexts = [
		{
			rotation: [0, Math.PI / 2, 0],
			position: [x + w / 2 + eps, y, z],
			type: type,
		},
		{
			rotation: [-Math.PI / 2, 0, Math.PI / 2],
			position: [x, y + h / 2 + eps, z],
			type: type,
		},
		{ rotation: [0, 0, 0], position: [x, y, z + l / 2 + eps], type: type },
		{
			rotation: [0, -Math.PI / 2, 0],
			position: [x - w / 2 - eps, y, z],
			type: type,
		},
		{
			rotation: [Math.PI / 2, 0, -Math.PI / 2],
			position: [x, y - h / 2 - eps, z],
			type: type,
		},
		{
			rotation: [0, -Math.PI, 0],
			position: [x, y, z - l / 2 - eps],
			type: type,
		},
	];

	const toggleColor = () => {
		boxColor === color ? setBoxColor(boxEditColor) : setBoxColor(color);
	};

	return (
		<>
			<mesh
				onClick={(e) => {
					if (edit) {
						e.stopPropagation();
						toggleColor();
						changeBoxIndices(id);
						changeBoxById(id, {
							id: id,
							order: order,
							position: position,
							type: type,
							color: color,
							size: size,
							isIn: isIn,
						});
					}
				}}
				ref={mesh}
				position={position}
			>
				<boxGeometry args={size} />
				<meshBasicMaterial
					color={edit ? boxColor : color}
					opacity={edit ? 0.9 : 1}
					transparent={true}
				/>
			</mesh>

			{boxTexts.map(({ rotation, position, type }, id) => {
				return (
					<BoxText
						key={id}
						rotation={rotation}
						position={position}
						text={type}
					/>
				);
			})}
		</>
	);
};
