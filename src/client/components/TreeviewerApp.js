import React from 'react'
import FactoryNode from './FactoryNode'
import ActionBar from './ActionBar'
const socket = io() // loaded from CDN on index.html

export default class TreeviewerApp extends React.Component {
  state = {
    tree: []
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

  render() {
    var factories = this.state.tree.length ? (
      this.state.tree.map((factoryNode, index) => (
        <FactoryNode
          key={factoryNode.factoryName}
          data={factoryNode}
        />
      ))
    ) : (
        "There are no factory nodes... create one?"
      )
    return (
      <div>
        {factories}
        <ActionBar handleCreateFactory={this.handleCreateFactory} />
      </div>
    )
  }
}
