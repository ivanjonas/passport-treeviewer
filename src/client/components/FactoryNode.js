import React from 'react'

export default class FactoryNode extends React.Component {
  render() {
    const data = this.props.data

    return (
      <div className="FactoryNode">
        <span>{data.factoryName} ({data.min} : {data.max})</span>
        <ul>
          {
            data.nodes.map((element, index) => (
              <li key={index}>{element}</li>
            ))
          }
        </ul>
        <div>
          <button>Rename</button>
          <button>Delete</button>
          <button>Regen</button>
        </div>
      </div>
    )
  }
}