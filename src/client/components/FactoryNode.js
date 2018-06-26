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

    this.props.handleRenameFactory(this.props.factory.id)
  }

  handleChangeBounds = (e) => {
    e.preventDefault()

    const minField = e.target.elements.min
    const maxField = e.target.elements.max
    let min
    let max

    try {
      min = parseInt(minField.value, 10)
      max = parseInt(maxField.value, 10)
    } catch (error) {
      // type error. Is this even possible with html validation?
      return
    }

    // validate
    if (min > max) {
      maxField.classList.add('error')
      // max must be greater than min
      return
    }

    this.props.handleChangeBounds({
      factoryId: this.props.factory.id,
      min,
      max
    }, (result) => {
      if (!result.success) {
        alert(result.message)
      }
    })
  }

  render() {
    const factory = this.props.factory

    return (
      <div className="FactoryNode">
        <div>
          {factory.factoryName} ({factory.min} : {factory.max})
          <form onSubmit={this.handleChangeBounds}>
            <input type="number" name="min" min="0" step="1" defaultValue={factory.min} />
            <input type="number" name="max" min="0" step="1" defaultValue={factory.max} />
            <button type="submit">Change bounds</button>
          </form>
        </div>
        <div>
          <button onClick={this.handleRenameFactory}>Rename</button>
          <button onClick={this.handleDeleteFactory}>Delete</button>
          <button onClick={this.handleGenerateNodes}>
            {factory.length ? 'Regen Child Nodes' : 'Generate Child Nodes'}
          </button>
          <input type="number" min="0" max="15" step="1" name="count" />
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
