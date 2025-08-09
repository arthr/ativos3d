import { Hud, Html } from "@react-three/drei";
import { Toolbar } from "../../ui/Toolbar";
import { BudgetBar } from "../../ui/BudgetBar";
import { CatalogHud, InspectorHud } from "../../ui/hud";

export function HudOverlay() {
	return (
		<Hud renderPriority={1}>
			<Html fullscreen transform={false} prepend>
				<div style={{ pointerEvents: "auto" }} data-hud="true">
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
						}}>
						<BudgetBar />
					</div>
					<div style={{ position: "absolute", bottom: 50, left: 8 }}>
						<Toolbar />
					</div>
					<div
						style={{
							position: "absolute",
							bottom: 50,
							right: 8,
							width: 360,
						}}>
						<CatalogHud />
					</div>
					<div
						style={{
							position: "absolute",
							top: 56,
							right: 8,
							width: 280,
						}}>
						<InspectorHud />
					</div>
				</div>
			</Html>
		</Hud>
	);
}
