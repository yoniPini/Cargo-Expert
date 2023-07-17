import { Plane } from "./Plane.js";
export const Container = ({ size }) => {
	const [w, h, l] = size;
	return (
		<>
			<Plane
				/* SmallBack */
				size={[w, h]}
				position={[w / 2, h / 2, 0]}
				rotation={[0, 0, 0]}
			/>
			<Plane
				/* LargeBack */
				size={[l, h]}
				position={[0, h / 2, l / 2]}
				rotation={[0, Math.PI / 2, 0]}
			/>
			<Plane
				/* LargeFront */
				size={[l, h]}
				position={[w, h / 2, l / 2]}
				rotation={[0, -Math.PI / 2, 0]}
			/>
			{/* SmallFront */}
			{/*
			<Plane
				size={[w, h]}
				position={[w / 2, h / 2, l]}
				rotation={[0, Math.PI, 0]}
			/>
            */}
			<Plane
				/* Bottom */
				size={[l, w]}
				position={[w / 2, 0, l / 2]}
				rotation={[-Math.PI / 2, 0, Math.PI / 2]}
			/>
			<Plane
				/* Top */
				size={[l, w]}
				position={[w / 2, h, l / 2]}
				rotation={[Math.PI / 2, 0, Math.PI / 2]}
			/>
		</>
	);
};
