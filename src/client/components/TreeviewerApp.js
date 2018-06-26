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

  handleGenerateNodes = (generateNodeRequest, fn) => {
    socket.emit('/api/generateNodes', generateNodeRequest, (response) => {
      fn(response)
    })
  }

  handleDeleteFactory = (factoryId, fn) => {
    socket.emit('/api/deleteFactory', factoryId, (response) => {
      fn(response)
    })
  }

  handleRenameFactory = (factoryId) => {
    // user wants to rename a factory. Show the appropriate modal content

    const emitRenameRequest = (name) => {
      // pull up the modal and confirm the request data
      const request = { factoryId, name }
      socket.emit('/api/renameFactory', request, (response) => {
        if (response.success) {
          this.handleCloseModal()
        } else {
          alert(response.message)
        }
      })
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
          handleModalSubmission={this.state.handleModalSubmission}
          handleRequestClose={this.handleCloseModal}
        />
      </div>
    )
  }
}
