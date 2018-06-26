// * These components exist because of the limitations of state functionality
// * inside the `componentWillMount` of Modal.js. But they also help keep
// * Modal.js neater

import React from 'react'

class CreateFactoryNode extends React.Component {
  state = {
    isSubmitButtonEnabled: true
  }

  handleSubmit = (e) => {
    e.preventDefault()

    let name = e.target.elements.name.value.trim()
    let min = e.target.elements.min.value.trim()
    let max = e.target.elements.max.value.trim()

    this.props.handleModalSubmission(name, min, max)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Name: <input type="text" name="name" /></label>
          <label>Min: <input type="number" name="min" /></label>
          <label>Max: <input type="number" name="max" /></label>
          <button
            type='submit'
            className='Button Button--big'
            disabled={!this.state.isSubmitButtonEnabled}
          >
            Create new factory node
          </button>
        </form>
        <button className='Button' onClick={this.props.handleRequestClose}>Never mind</button>
      </div>
    )
  }
}

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
        <button className='Button' onClick={this.props.handleRequestClose}>Keep current name</button>
      </form>
    )
  }
}

class ChangeBounds extends React.Component {
  render() {
    return (
      <div>
        <form onSubmit={(e) => {
          e.preventDefault()

          const minField = e.target.elements.min
          const maxField = e.target.elements.max
          let min
          let max

          try {
            min = parseInt(minField.value, 10)
            max = parseInt(maxField.value, 10)
          } catch (error) {
            // type error. Is this even possible or necessary with html validation?
            // TODO additional validation
            return
          }

          // validate
          if (min > max) {
            maxField.classList.add('error')
            // TODO additional validation
            return
          }

          this.props.handleModalSubmission(min, max)
        }}>
          <input type="number" name="min" min="0" step="1" />
          <input type="number" name="max" min="0" step="1" />
          <button type="submit">Change bounds</button>
        </form>
        <button className='Button' onClick={this.props.handleRequestClose}>Keep current bounds</button>
      </div>
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

export default { CreateFactoryNode, GenerateChildNodes, RenameFactoryNode, ChangeBounds, DeleteFactoryNode }
