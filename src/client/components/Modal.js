import React from 'react'
import ReactModal from 'react-modal'
import TOKENS from '../config/tokens'

ReactModal.setAppElement(document.getElementById('app'))

const modalContent = {}
export default class Modal extends React.Component {
  componentWillMount() {

    modalContent[TOKENS.modes.rename] = {
      title: "New factory name:",
      body: (
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

    modalContent[TOKENS.modes.delete] = {
      title: "Are you sure you want to delete this factory?",
      body: (
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

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        contentLabel="Selected Option"
        onRequestClose={this.props.handleClearSelection}
        closeTimeoutMS={TOKENS.modal.fadeoutDuration}
        className="Modal"
      >

        <h3 className="Modal-title">{this.props.mode && modalContent[this.props.mode].title}</h3>
        <div className="Modal-body">{this.props.mode && modalContent[this.props.mode].body}</div>
      </ReactModal>
    )
  }
}
