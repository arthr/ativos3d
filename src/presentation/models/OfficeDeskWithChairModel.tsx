import type { JSX } from "react";
import OfficeDeskModel from "./OfficeDeskModel";
import OfficeChairModel from "./OfficeChairModel";

export type ModelProps = JSX.IntrinsicElements["group"];

export default function OfficeDeskWithChairModel(props: ModelProps): JSX.Element {
    const gapBetweenDeskAndChair = 0.5; // "pés"/espaço entre a rack e a tv
    return (
        <group {...props}>
            <OfficeDeskModel />
            <OfficeChairModel position={[0, 0, 0 - gapBetweenDeskAndChair]} />
        </group>
    );
}
