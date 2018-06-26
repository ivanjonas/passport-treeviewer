import React from 'react'

class CreateFactoryNode extends React.Component {
  state = {
    isSubmitButtonEnabled: true
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const nameField = e.target.elements.name
    const minField = e.target.elements.min
    const maxField = e.target.elements.max
    const name = nameField.value.trim()
    const min = parseInt(minField.value, 10)
    const max = parseInt(maxField.value, 10)

    if (!validateName(nameField)) {
      return
    }
    if (!validateBounds(minField, maxField)) {
      return
    }

    this.props.handleModalSubmission(name, min, max)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Name: <input type="text" name="name" minLength="1" placeholder="name" required onKeyUp={handleValidateNameChange} /></label>
          <label>Min: <input type="number" name="min" min="0" placeholder="min" required onKeyUp={handleValidateBoundsChange} /></label>
          <label>Max: <input type="number" name="max" min="0" placeholder="max" required onKeyUp={handleValidateBoundsChange} /></label>
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

  handleSubmit = (e) => {
    e.preventDefault()

    const countField = e.target.elements.count
    let count = parseInt(countField.value.trim(), 10)

    if (isNaN(count) || count < 0 || count > 15) {
      countField.reportValidity('Count must be between 0 and 15, inclusive.')
    }

    this.props.handleModalSubmission(count)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="number" min="0" max="15" step="1" name="count"
            onChange={(e) => {
              // if value not valid, disable the submit button

              const isEnabled = e.target.reportValidity()
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
        </form>
        <button className='Button' onClick={this.props.handleRequestClose}>No, keep existing child nodes</button>
      </div>
    )
  }
}

class RenameFactoryNode extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()

    const nameField = e.target.elements.name

    if (!validateName(nameField)) {
      return
    }

    this.props.handleModalSubmission(nameField.value.trim())
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="new name" onKeyUp={handleValidateNameChange} />
          <button type="submit" className="Button">Rename</button>
        </form>
        <button className='Button' onClick={this.props.handleRequestClose}>Keep current name</button>
      </div>
    )
  }
}

class ChangeBounds extends React.Component {
  handleFormSubmit = (e) => {
    e.preventDefault()

    const minField = e.target.elements.min
    const maxField = e.target.elements.max
    const min = parseInt(minField.value, 10)
    const max = parseInt(maxField.value, 10)

    if (!validateBounds(minField, maxField)) {
      return
    }

    this.props.handleModalSubmission(min, max)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <label>Min <input type="number" name="min" placeholder="min" min="0" step="1" required onKeyUp={handleValidateBoundsChange} /></label>
          <label>Max <input type="number" name="max" placeholder="max" min="0" step="1" required onKeyUp={handleValidateBoundsChange} /></label>
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

// Validation utils:

const validateName = (nameField) => {
  if (nameField.value.trim().length === 0) {
    nameField.setCustomValidity('Name length must be greater than zero, excluding whitespace')
    nameField.reportValidity()
    return false
  }
  return true
}

const validateBounds = (minField, maxField) => {
  const min = parseInt(minField.value, 10)
  const max = parseInt(maxField.value, 10)

  if (max < min) {
    maxField.setCustomValidity('Max value cannot be larger than Min value.')
    maxField.reportValidity()
    return false
  }
  return true
}

const handleValidateNameChange = (e) => {
  const nameField = e.target.closest('form').elements.name
  const name = nameField.value.trim()

  if (name.length > 0 && (nameField.validity.customError)) {
    // only clear the error if it's already errored but has been resolved
    nameField.setCustomValidity('')
    nameField.reportValidity()
  }
}

const handleValidateBoundsChange = (e) => {
  const formElements = e.target.closest('form').elements
  const maxField = formElements.max
  const max = parseInt(maxField.value, 10)
  const min = parseInt(formElements.min.value, 10)

  if (!isNaN(max) && !isNaN(min)) {
    // it's checkable
    if (max >= min && (maxField.validity.customError)) {
      // only clear the error if it's already errored but has been resolved
      maxField.setCustomValidity('')
      maxField.reportValidity()
    }
  }
}

export default { CreateFactoryNode, GenerateChildNodes, RenameFactoryNode, ChangeBounds, DeleteFactoryNode }
