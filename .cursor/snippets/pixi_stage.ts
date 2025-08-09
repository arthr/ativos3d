import { Stage } from "@pixi/react";
import { FC } from "react";

export const PixiStage: FC = ({ children }) => {
	return (
		<Stage
			width={window.innerWidth}
			height={window.innerHeight}
			options={{ backgroundColor: 0xeeeeee }}>
			{children}
		</Stage>
	);
};
