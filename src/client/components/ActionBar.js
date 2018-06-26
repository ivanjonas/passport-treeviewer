import React from 'react'

export default class CreateFactoryNodeForm extends React.Component {
  render() {
    return (
      <button onClick={this.props.handleCreateFactoryNode}> Create a new Factory Node</button>
    )
  }
}
