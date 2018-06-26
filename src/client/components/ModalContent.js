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
      <div>
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
          onClick={(e) => {
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
          }}
        >
          Yes, generate new child nodes
      </button>
        <button className='Button' onClick={this.props.handleRequestClose}>No, keep existing child nodes</button>
      </div>
    )
  }
}

export default { GenerateChildNodes }
