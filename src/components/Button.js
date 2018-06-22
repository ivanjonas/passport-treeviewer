import React from 'react'

export default class Button extends React.Component {
  testAlert() {
    alert('React works')
  }

  render() {
    return (
      <button className="Button" onClick={this.testAlert}>
        Press me, I'm a React button
      </button>
    )
  }
}