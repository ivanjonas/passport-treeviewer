import React from 'react'
import ReactModal from 'react-modal'
import ModalContent from './ModalContent'
import TOKENS from '../config/tokens'

ReactModal.setAppElement(document.getElementById('app'))

const modalContent = {}
export default class Modal extends React.Component {
  componentWillMount() {
    const attributes = {
      handleRequestClose: this.props.handleRequestClose,
      handleModalSubmission: this.props.handleModalSubmission
    }

    modalContent[TOKENS.modes.rename] = {
      title: "New factory name:",
      body: React.createElement(ModalContent.RenameFactoryNode, attributes)
    }

    modalContent[TOKENS.modes.delete] = {
      title: "Are you sure you want to delete this factory?",
      body: React.createElement(ModalContent.DeleteFactoryNode, attributes)
    }

    modalContent[TOKENS.modes.generateChildNodes] = {
      title: "Generating will remove existing child nodes. Continue?",
      body: React.createElement(ModalContent.GenerateChildNodes, attributes)
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
