import React from 'react'
import FactoryNode from './FactoryNode'
import ActionBar from './ActionBar'
const axios = window.axios // loaded from CDN on index.html

export default class TreeviewerApp extends React.Component {
  state = {
    tree: []
  }

  componentDidMount() {
    axios.get('/api/getTree').then(response => {
      this.setState(() => ({ tree: response.data }))
    }).catch(error => {
      console.error("Could not retrieve fresh tree data from server.")
      throw error
    })
  }

  handleCreateFactory = (e) => {
    e.preventDefault()

    var data = {
      name: e.target.elements.name.value,
      min: e.target.elements.min.value,
      max: e.target.elements.max.value
    }

    axios.post('/api/createFactory', data)
      .then(response => {
        if (!response.data.success) return

        this.setState(prevState => ({
          tree: prevState.tree.concat(response.data.newFactory)
        }))
      })
      .catch(error => {
        console.log(error);
      });
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
