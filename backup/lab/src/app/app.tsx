import * as React from "react"
import Button from 'tfw/view/button'

import './app.css'

const ChildProcess = require('child_process')

// const _ = Tfw.Intl.make(require('./app.json'))

export interface IAppProps {
    className?: string
}

// tslint:disable-next-line: no-empty-interface
interface IAppState {}

export default class App extends React.Component<IAppProps, IAppState> {
    state: IAppState = {}

    componentDidMount() {
        const splash = document.getElementById("splash-screen")
        if (!splash) return

        document.body.removeChild(splash)
    }

    private readonly handleSuspend = () => {
        ChildProcess.exec("systemctl suspend")
    }

    render() {
        const classNames = ['custom', '-App']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <Button
                icon="logout"
                onClick={this.handleSuspend}
            />
        </div>
    }
}
