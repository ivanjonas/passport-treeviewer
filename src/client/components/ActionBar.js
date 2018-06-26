import React from 'react'

export default class CreateFactoryNodeForm extends React.Component {
  render() {
    return (
      <div className="c-ActionBar">
        <button className="c-Button c-ActionBar-newFactory" onClick={this.props.handleCreateFactoryNode}> Create a new Factory Node</button>
      </div>
    )
  }
}
