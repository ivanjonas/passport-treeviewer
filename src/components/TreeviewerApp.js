import React from 'react'
import FactoryNode from './FactoryNode'
import ActionBar from './ActionBar'

export default class TreeviewerApp extends React.Component {
  state = {
    tree: []
  }

  componentDidMount() {
    // TODO for now, fetch data from localstorage instead of server
    try {
      const string = localStorage.getItem('tree')
      const tree = JSON.parse(string)

      if (tree) {
        this.setState(() => ({ tree }))
      } else {
        // sample tree data
        const sampleTree = [{
          factoryName: "First Node",
          nodes: [10, 20, 30, 40, 50],
          min: 10,
          max: 50
        },
        {
          factoryName: "Last Node",
          nodes: [9, 18, 27],
          min: 3,
          max: 30
        }]

        this.setState(() => ({ tree: sampleTree }))
      }
    } catch (exception) {
      // there was no (valid) data in localstorage
      console.error('There was an error loading data into the Treeviewer App.')
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.tree.length !== this.state.tree.length) { // an insufficient test--node names may have changed
    const jsonString = JSON.stringify(this.state.tree)
    localStorage.setItem('tree', jsonString)
    // }
  }

  handleCreateFactory = (e) => {
    e.preventDefault()

    var data = {
      name: e.target.elements.name.value,
      min: e.target.elements.min.value,
      max: e.target.elements.max.value
    }

    axios.post('/createFactory', data)
      .then(response => {
        if (!response.data.success) return

        this.setState(prevState => ({
          tree: prevState.tree.push(response.data.newFactory)
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
