export const Plane = ({ size, position, rotation }) => {
	return (
		<mesh
			position={position}
			rotation={rotation}
		>
			<planeGeometry args={size} />
			<meshBasicMaterial />
			{/* <meshNormalMaterial /> */}
		</mesh>
	);
};
