import React from 'react'

export default class FactoryNode extends React.Component {
  handleGenerateNodes = (e) => {
    e.preventDefault()

    this.props.handleGenerateNodes(this.props.factory.id)
  }

  handleDeleteFactory = (e) => {
    e.preventDefault()

    this.props.handleDeleteFactory(this.props.factory.id)
  }

  handleRenameFactory = (e) => {
    e.preventDefault()

    this.props.handleRenameFactory(this.props.factory.id)
  }

  handleChangeBounds = (e) => {
    e.preventDefault()

    this.props.handleChangeBounds(this.props.factory.id)
  }

  render() {
    const factory = this.props.factory

    return (
      <div className="c-FactoryNode">
        <div className="c-FactoryNode-header">
          <div className="c-FactoryNode-header-info">
            <p
              className="c-FactoryNode-header-info-name"
              role="button"
              tabIndex="0"
              onClick={this.handleRenameFactory}
            >
              {factory.factoryName}
            </p>
            <span
              className="c-FactoryNode-header-info-boundary"
              role="button"
              tabIndex="0"
              onClick={this.handleChangeBounds}
            >
              ({factory.min} : {factory.max})
          </span>
          </div>
          <div className="c-FactoryNode-header-actions">
            <button
              onClick={this.handleDeleteFactory}
              className="c-FactoryNode-header-actions-button c-Button c-Button--icon c-Button--danger"
              title="delete this node"
            >
              <svg className="octicon octicon-trashcan" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"></path></svg>
            </button>
            <button
              onClick={this.handleGenerateNodes}
              className="c-FactoryNode-header-actions-button c-Button c-Button--icon c-Button--darkBackground"
              title="generate new child nodes"
            >
              {
                (factory.length === 0)
                ?
                <svg className="octicon octicon-sync" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M10.24 7.4a4.15 4.15 0 0 1-1.2 3.6 4.346 4.346 0 0 1-5.41.54L4.8 10.4.5 9.8l.6 4.2 1.31-1.26c2.36 1.74 5.7 1.57 7.84-.54a5.876 5.876 0 0 0 1.74-4.46l-1.75-.34zM2.96 5a4.346 4.346 0 0 1 5.41-.54L7.2 5.6l4.3.6-.6-4.2-1.31 1.26c-2.36-1.74-5.7-1.57-7.85.54C.5 5.03-.06 6.65.01 8.26l1.75.35A4.17 4.17 0 0 1 2.96 5z"></path></svg>
                :
                <svg className="octicon octicon-plus" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z"></path></svg>
              }
            </button>
          </div>
        </div>
        <ul className="c-FactoryNode-children">
          {
            factory.nodes.map((element, index) => (
              <li className="c-FactoryNode-childNode" key={index}>{element}</li>
            ))
          }
        </ul>
      </div>
    )
  }
}
