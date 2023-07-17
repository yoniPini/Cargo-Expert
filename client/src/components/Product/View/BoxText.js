import { Text } from "@react-three/drei";

export const BoxText = ({ position, rotation, text }) => {
	const textColor = "black";
	const textScale = [0.3, 0.3, 0.3];
	return (
		<Text
			scale={textScale}
			rotation={rotation}
			position={position}
			color={textColor}
		>
			{text}
		</Text>
	);
};
