import { Canvas } from "@react-three/fiber";
import { FC, ReactNode } from "react";

interface R3FStageProps {
	children: ReactNode;
}

export const R3FStage: FC<R3FStageProps> = ({ children }) => {
	return (
		<Canvas
			style={{ width: "100vw", height: "100vh", background: "#eeeeee" }}
			camera={{ position: [0, 5, 10], fov: 50 }}>
			{children}
		</Canvas>
	);
};
