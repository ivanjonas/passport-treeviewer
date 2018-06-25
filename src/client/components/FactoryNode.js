import React from 'react'

export default class FactoryNode extends React.Component {
  handleGenerateNodes = (e) => {
    e.preventDefault()

    const factory = this.props.factory
    const countField = e.target.nextElementSibling
    let count = countField.value.trim()
    try {
      count = parseInt(count, 10)
    } catch (error) {
      countField.classList.add('error')
    }

    if (count < 0 || count > 15) {
      countField.classList.add('error')
    }

    this.props.handleGenerateNodes({
      factoryId: factory.id,
      count
    }, (result) => {
      if (result.success) {
        countField.classList.remove('error')
      } else {
        alert(result.message)
      }
    })
  }

  handleDeleteFactory = (e) => {
    e.preventDefault()

    this.props.handleDeleteFactory(this.props.factory.id, (result) => {
      !result.success && alert(result.message)
    })
  }

  handleRenameFactory = (e) => {
    e.preventDefault()

    const nameField =  e.target.previousElementSibling
    const newName = nameField.value.trim()

    if (newName.length === 0) {
      return
    }

    this.props.handleRenameFactory({
      factoryId: this.props.factory.id,
      name: newName
    }, (result) => {
      if (!result.success) {
        alert('rename was unsuccessful')
      }
    })
  }

  render() {
    const factory = this.props.factory

    return (
      <div className="FactoryNode">
        <span>{factory.factoryName} ({factory.min} : {factory.max})</span>
        <ul>
          {
            factory.nodes.map((element, index) => (
              <li key={index}>{element}</li>
            ))
          }
        </ul>
        <div>
          <input type="text" name="name" placeholder="new name" />
          <button onClick={this.handleRenameFactory}>Rename</button>
          <button onClick={this.handleDeleteFactory}>Delete</button>
          <button onClick={this.handleGenerateNodes}>
            {factory.length ? 'Regen Child Nodes' : 'Generate Child Nodes'}
          </button>
          <input type="number" min="0" max="15" step="1" name="count" />
        </div>
      </div>
    )
  }
}
