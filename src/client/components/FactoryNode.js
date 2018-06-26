import React from 'react'

export default class FactoryNode extends React.Component {
  handleGenerateNodes = (e) => {
    e.preventDefault()

    this.props.handleGenerateNodes(this.props.factory.id)
  }

  handleDeleteFactory = (e) => {
    e.preventDefault()

    this.props.handleDeleteFactory(this.props.factory.id)
  }

  handleRenameFactory = (e) => {
    e.preventDefault()

    this.props.handleRenameFactory(this.props.factory.id)
  }

  handleChangeBounds = (e) => {
    e.preventDefault()

    this.props.handleChangeBounds(this.props.factory.id)
  }

  render() {
    const factory = this.props.factory

    return (
      <div className="FactoryNode">
        <div>
          {factory.factoryName}
          <span
            className="FactoryNode-boundary"
            role="button"
            tabIndex="0"
            onClick={this.handleChangeBounds}
          >
            ({factory.min} : {factory.max})
          </span>

        </div>
        <div>
          <button onClick={this.handleRenameFactory}>Rename</button>
          <button onClick={this.handleDeleteFactory}>Delete</button>
          <button onClick={this.handleGenerateNodes}>
            {factory.length ? 'Regen Child Nodes' : 'Generate Child Nodes'}
          </button>
        </div>
        <ul>
          {
            factory.nodes.map((element, index) => (
              <li key={index}>{element}</li>
            ))
          }
        </ul>
      </div>
    )
  }
}
