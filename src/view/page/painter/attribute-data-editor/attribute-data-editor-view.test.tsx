// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from 'react';
import Renderer from 'react-test-renderer'
import AttributeDataEditorView, { IAttributeDataEditorViewProps } from './attribute-data-editor-view'

function view(partialProps: Partial<IAttributeDataEditorViewProps>) {
    const props: IAttributeDataEditorViewProps = {
        // @TODO Set default props.
        ...partialProps
    }
    return Renderer.create(<AttributeDataEditorView {...props} />).toJSON()
}

describe('<AttributeDataEditorView/> in view/page/painter', () => {
    it('should be consistent with previous snapshot', () => {
        expect(view({})).toMatchSnapshot()
    })
})
