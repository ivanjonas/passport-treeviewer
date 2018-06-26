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
          <div className="c-Modal-body-row">
            <label>Name: <input type="text" name="name" minLength="1" placeholder="name" required onKeyUp={handleValidateNameChange} /></label>
          </div>
          <div className="c-Modal-body-row">
            <label>Min: <input type="number" name="min" min="0" placeholder="min" required onKeyUp={handleValidateBoundsChange} /></label>
          </div>
          <div className="c-Modal-body-row">
            <label>Max: <input type="number" name="max" min="0" placeholder="max" required onKeyUp={handleValidateBoundsChange} /></label>
          </div>
          <div className="c-Modal-body-actions">
            <button
              type='submit'
              className='c-Button Button--big'
              disabled={!this.state.isSubmitButtonEnabled}
            >
              Create new factory node
            </button>
          </div>
        </form>
        <button className='c-Button' onClick={this.props.handleCloseModal}>Never mind</button>
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
    const count = parseInt(countField.value.trim(), 10)

    if (isNaN(count) || count < 0 || count > 15 || countField.value.length === 0) {
      countField.setCustomValidity('Count must be between 0 and 15, inclusive.')
      countField.reportValidity()
      return
    }

    this.props.handleModalSubmission(count)
  }

  handleValidateCountChange = (e) => {
    const countField = e.target
    const count = parseInt(countField.value.trim(), 10)
  
    if (!isNaN(count) && count >= 0 && count <=15 && (countField.validity.customError)) {
      // only clear the error if it's already errored but has been resolved
      countField.setCustomValidity('')
      countField.reportValidity()
    }

    const isEnabled = e.target.reportValidity()
    this.setState((prevState) => ({
      isSubmitButtonEnabled: isEnabled
    }))
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Count: <input type="number" min="0" max="15" step="1" name="count"
            placeholder="count" onChange={this.handleValidateCountChange} />
          </label>
          <div className="c-Modal-body-actions">
            <button
              type="submit"
              className="c-Button"
              disabled={!this.state.isSubmitButtonEnabled}
            >
              Yes, generate new nodes
            </button>
          </div>
        </form>
        <button className='c-Button' onClick={this.props.handleCloseModal}>No, keep existing nodes</button>
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
          <label>New name: <input type="text" name="name" placeholder="new name" onKeyUp={handleValidateNameChange} /></label>
          <div className="c-Modal-body-actions">
            <button type="submit" className="c-Button">Rename</button>
          </div>
        </form>
        <button className='c-Button' onClick={this.props.handleCloseModal}>Keep current name</button>
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
          <div className="c-Modal-body-row">
            <label>Min: <input type="number" name="min" placeholder="min" min="0" step="1" required onKeyUp={handleValidateBoundsChange} /></label>
          </div>
          <div className="c-Modal-body-row">
            <label>Max: <input type="number" name="max" placeholder="max" min="0" step="1" required onKeyUp={handleValidateBoundsChange} /></label>
          </div>
          <div className="c-Modal-body-actions">
            <button className='c-Button' type="submit">Change bounds</button>
          </div>
        </form>
        <button className='c-Button' onClick={this.props.handleCloseModal}>Keep current bounds</button>
      </div>
    )
  }
}

class DeleteFactoryNode extends React.Component {
  render() {
    return (
      <div>
        <div className="c-Modal-body-actions">
          <button
            type="submit"
            className="c-Button"
            onClick={(e) => {
              e.preventDefault()

              this.props.handleModalSubmission()
            }}
          >
            Delete
          </button>
        </div>
        <button className='c-Button' onClick={this.props.handleCloseModal}>No, don't delete</button>
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
