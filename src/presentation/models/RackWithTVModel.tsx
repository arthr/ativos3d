import type { JSX } from "react";
import RackModel, { RACK_DIMS } from "./RackModel";
import TVModel from "./TVModel";

export type ModelProps = JSX.IntrinsicElements["group"];

export default function RackWithTVModel(props: ModelProps): JSX.Element {
    const rackTopY = RACK_DIMS.y; // topo da rack em y
    const tvBottomClearance = 0.01; // "pés"/espaço entre a rack e a tv
    return (
        <group {...props}>
            <RackModel />
            <TVModel position={[0, rackTopY + tvBottomClearance, 0]} />
        </group>
    );
}
