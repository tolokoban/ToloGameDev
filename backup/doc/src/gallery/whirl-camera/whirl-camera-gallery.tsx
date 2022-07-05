import * as React from "react"
import * as TGD from 'tolo-game-dev'
import View from './whirl-camera-view'

import './whirl-camera-gallery.css'

class IScene extends TGD.Scene { }




export interface IWhirlCameraGalleryProps {
    className?: string
}

// tslint:disable-next-line: no-empty-interface
interface IWhirlCameraGalleryState {}

export default class WhirlCameraGallery extends React.Component<IWhirlCameraGalleryProps, IWhirlCameraGalleryState> {
    state: IWhirlCameraGalleryState = {}

    render() {
        const classNames = ['custom', 'gallery-WhirlCameraGallery']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <View />
        </div>
    }
}
