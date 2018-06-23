import React from 'react'
import FactoryNode from './FactoryNode'

export default class TreeviewerApp extends React.Component {
  state = {
    tree: [{
      factoryName: "First Node",
      nodes: [10, 20, 30, 40, 50]
    },
    {
      factoryName: "Last Node",
      nodes: [9, 18, 27]
    }]
  }

  componentDidMount() {
    // TODO for now, fetch data from localstorage instead of server
    try {
      const string = localStorage.getItem('tree')
      const options = JSON.parse(string)

      if (options) {
        this.setState(() => ({ options }))
      }
    } catch (exception) {
      // there was no (valid) data in localstorage
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.tree.length !== this.state.tree.length) { // an insufficient test--node names may have changed
    const json = JSON.stringify(this.state.tree)
    localStorage.setItem('tree', json)
    // }
  }

  render() {
    return (
      <div>
        {
          this.state.tree.map((factoryNode, index) => (
            <FactoryNode
              key={factoryNode.factoryName}
              data={factoryNode}
            />
          ))
        }
      </div>
    )
  }
}
