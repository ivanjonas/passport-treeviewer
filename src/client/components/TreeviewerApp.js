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
  }

  handleCreateFactoryNode = () => {
    const emitCreateFactoryNode = (name, min, max) => {
      const request = { name, min, max }
      socket.emit('/api/createFactory', request, this.modalRespondToSocketResponse)
    }

    this.setState((prevState) => ({
      isModalOpen: true,
      mode: TOKENS.modes.createFactoryNode,
      handleModalSubmission: emitCreateFactoryNode
    }))
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

  handleChangeBounds = (factoryId) => {
    const emitChangeBounds = (min, max) => {
      const request = { factoryId, min, max }
      socket.emit('/api/changeBounds', request, this.modalRespondToSocketResponse)
    }

    this.setState((prevState) => ({
      isModalOpen: true,
      mode: TOKENS.modes.changeBounds,
      handleModalSubmission: emitChangeBounds
    }))
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
    let factories
    if (this.state.tree.length) {
      factories = (
        <div className="c-TreeviewerApp-factoryNodes"> {
          this.state.tree.map((factoryNode, index) => (
            <FactoryNode key={factoryNode.id}
              factory={factoryNode}
              handleGenerateNodes={this.handleGenerateNodes}
              handleDeleteFactory={this.handleDeleteFactory}
              handleRenameFactory={this.handleRenameFactory}
              handleChangeBounds={this.handleChangeBounds}
            />))
          }
        </div>
      )
    } else {
      factories = (
        <div className="u-mt-10 u-textCenter">There are no factory nodes... create one?</div>
      )
    }

    return (
      <div className="c-TreeviewerApp">
        {factories}
        <ActionBar handleCreateFactoryNode={this.handleCreateFactoryNode} />
        <Modal
          isOpen={this.state.isModalOpen}
          mode={this.state.mode}
          handleModalSubmission={this.handleModalSubmission}
          handleCloseModal={this.handleCloseModal}
        />
      </div>
    )
  }

  // Utils:

  modalRespondToSocketResponse = (response) => {
    // * For most modals, simply close the modal on success
    // * and alert the user of any back end message on failure.
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
