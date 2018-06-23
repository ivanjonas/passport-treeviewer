import React from 'react'

const CreateFactoryNodeForm = (props) => (
  <form onSubmit={props.handleCreateFactory}>
    <label>Name: <input type="text" name="name" /></label>
    <label>Min: <input type="number" name="min" /></label>
    <label>Max: <input type="number" name="max" /></label>
    <button
      type='submit'
      className='Button Button--big'
      disabled={false}
    >
      Create new factory node
    </button>
  </form>
)

export default CreateFactoryNodeForm