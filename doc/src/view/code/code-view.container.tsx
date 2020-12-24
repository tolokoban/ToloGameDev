import { connect } from 'react-redux'
import CodeView, { ICodeViewProps } from './code-view'
import { IAppState, IAction } from '../../types'

function mapStateToProps(
    state: IAppState,
    props: Partial<ICodeViewProps>
): ICodeViewProps {
    return { ...props }
}

function mapDispatchToProps(
    dispatch: (action: IAction) => void,
    props: Partial<ICodeViewProps>
) {
    // @see https://redux.js.org/basics/usage-with-react/#implementing-container-components
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeView)
