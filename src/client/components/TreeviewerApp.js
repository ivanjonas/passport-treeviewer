import React from 'react'
import FactoryNode from './FactoryNode'
import ActionBar from './ActionBar'
import Modal from './Modal'
import TOKENS from '../config/tokens'
const socket = io() // loaded from CDN on index.html

export default class TreeviewerApp extends React.Component {
  state = {
    tree: [],
    mode: TOKENS.modes.default,
    isModalOpen: false,
    handleModalSubmission: undefined
  }

  componentDidMount() {
    socket.on('/api/getTree', (tree) => {
      this.setState(() => ({ tree }))
    })

    // socket.emit('/api/getTree') // this is how you request a new tree
  }

  handleCreateFactory = (e) => {
    e.preventDefault()

    var data = {
      name: e.target.elements.name.value,
      min: e.target.elements.min.value,
      max: e.target.elements.max.value
    }

    socket.emit('/api/createFactory', data, (response) => {
      if (!response.success) {
        alert(response.message)
      } // else it was a success and the server will broadcast the new tree
    })
  }

  handleGenerateNodes = (factoryId) => {
    const emitGenerateNodesRequest = (count) => {
      const request = { factoryId, count }
      socket.emit('/api/generateNodes', request, this.modalRespondToSocketResponse)
    }

    this.setState((prevState) => ({
      isModalOpen: true,
      mode: TOKENS.modes.generateChildNodes,
      handleModalSubmission: emitGenerateNodesRequest
    }))
  }

  handleDeleteFactory = (factoryId) => {
    // User wants to delete a factory. Confirm first.

    const emitDeleteRequest = () => {
      socket.emit('/api/deleteFactory', factoryId, this.modalRespondToSocketResponse)
    }

    this.setState((prevState) => ({
      isModalOpen: true,
      mode: TOKENS.modes.delete,
      handleModalSubmission: emitDeleteRequest
    }))
  }

  handleRenameFactory = (factoryId) => {
    // User wants to rename a factory. Ask for the new name with a modal.

    const emitRenameRequest = (name) => {
      const request = { factoryId, name }
      socket.emit('/api/renameFactory', request, this.modalRespondToSocketResponse)
    }

    this.setState((prevState) => ({
      isModalOpen: true,
      mode: TOKENS.modes.rename,
      handleModalSubmission: emitRenameRequest
    }))
  }

  handleChangeBounds = (changeBoundsRequest, fn) => {
    socket.emit('/api/changeBounds', changeBoundsRequest, (response) => {
      fn(response)
    })
  }

  handleCloseModal = () => {
    // These two groups of state are different in order to avoid
    // a visual bug when closing the modal.
    this.setState((prevState) => ({
      isModalOpen: false,
      handleModalSubmission: undefined
    }))
    window.setTimeout(() => {
      this.setState((prevState) => ({
        mode: TOKENS.modes.default
      }))
    }, TOKENS.modal.fadeoutDuration)
  }

  render() {
    var factories = this.state.tree.length ? (
      this.state.tree.map((factoryNode, index) => (
        <FactoryNode
          key={factoryNode.factoryName}
          factory={factoryNode}
          handleGenerateNodes={this.handleGenerateNodes}
          handleDeleteFactory={this.handleDeleteFactory}
          handleRenameFactory={this.handleRenameFactory}
          handleChangeBounds={this.handleChangeBounds}
        />
      ))
    ) : (
        "There are no factory nodes... create one?"
      )
    return (
      <div>
        {factories}
        <ActionBar handleCreateFactory={this.handleCreateFactory} />
        <Modal
          isOpen={this.state.isModalOpen}
          mode={this.state.mode}
          handleModalSubmission={this.handleModalSubmission}
          handleRequestClose={this.handleCloseModal}
        />
      </div>
    )
  }

  // Utils:

  modalRespondToSocketResponse = (response) => {
    response.success ? this.handleCloseModal() : alert(response.message)
  }

  handleModalSubmission = (function () {
    // * This utility method merely passes all arguments to a function 
    // * that is set in the top-level state. It is not possible to pass 
    // * state into the props of a subcomponent, so this function fills 
    // * the gap.
    // ! This must not be an arrow function to access `arguments` array
    this.state.handleModalSubmission.apply(this, arguments)
  }).bind(this)
}
