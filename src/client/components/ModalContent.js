// * These components exist because of the limitations of state functionality
// * inside the `componentWillMount` of Modal.js. But they also help keep
// * Modal.js neater

import React from 'react'

class GenerateChildNodes extends React.Component {
  state = {
    isSubmitButtonEnabled: true
  }

  render() {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()

        const countField = e.target.elements.count
        let count = countField.value.trim()
        try {
          count = parseInt(count, 10)
        } catch (error) {
          countField.classList.add('error')
          // TODO further validation message
        }

        if (isNaN(count) || count < 0 || count > 15) {
          countField.classList.add('error')
          // TODO further validation message
        }

        this.props.handleModalSubmission(count)
      }
      }>
        <input type="number" min="0" max="15" step="1" name="count"
          onChange={(e) => {
            // if value not valid, disable the submit button

            const isEnabled = e.target.checkValidity()
            this.setState((prevState) => ({
              isSubmitButtonEnabled: isEnabled
            }))
          }}
        />
        <button
          type="submit"
          className="Button"
          disabled={!this.state.isSubmitButtonEnabled}
        >
          Yes, generate new child nodes
      </button>
        <button className='Button' onClick={this.props.handleRequestClose}>No, keep existing child nodes</button>
      </form>
    )
  }
}

class RenameFactoryNode extends React.Component {
  render() {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()

        const nameField = e.target.elements.name
        const newName = nameField.value.trim()

        if (newName.length === 0) {
          // TODO error message/HTML validation
          return
        }

        this.props.handleModalSubmission(newName)
      }}>
        <input type="text" name="name" placeholder="new name" />
        <button type="submit" className="Button">Rename</button>
        <button className='Button' onClick={this.props.handleRequestClose}>Never mind</button>
      </form>
    )
  }
}

class DeleteFactoryNode extends React.Component {
  render() {
    return (
      <div>
        <button
          type="submit"
          className="Button"
          onClick={(e) => {
            e.preventDefault()

            this.props.handleModalSubmission()
          }}
        >
          Delete
      </button>
        <button className='Button' onClick={this.props.handleRequestClose}>No, don't delete</button>
      </div>
    )
  }
}

export default { GenerateChildNodes, RenameFactoryNode, DeleteFactoryNode }
