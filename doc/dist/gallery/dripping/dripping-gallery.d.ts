import * as React from "react";
import './dripping-gallery.css';
export interface IDrippingGalleryProps {
    className?: string;
}
interface IDrippingGalleryState {
    colorA0: string;
    colorA1: string;
    colorB0: string;
    colorB1: string;
    colorC0: string;
    colorC1: string;
}
export default class DrippingGallery extends React.Component<IDrippingGalleryProps, IDrippingGalleryState> {
    state: IDrippingGalleryState;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=dripping-gallery.d.ts.map