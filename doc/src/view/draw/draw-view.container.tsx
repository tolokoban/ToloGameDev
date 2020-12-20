import { connect } from 'react-redux'
import DrawView, { IDrawViewProps } from './draw-view'
import { IAppState, IAction } from '../../types'

function mapStateToProps(
    state: IAppState,
    props: Partial<IDrawViewProps>
): IDrawViewProps {
    return { ...props }
}

function mapDispatchToProps(
    dispatch: (action: IAction) => void,
    props: Partial<IDrawViewProps>
) {
    // @see https://redux.js.org/basics/usage-with-react/#implementing-container-components
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawView)
