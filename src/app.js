import React from 'react'
import ReactDOM from 'react-dom'
import Button from './components/Button'
import numGen from './client/scripts/lib/number-generator'

ReactDOM.render(<Button />, document.getElementById('app'))
console.log(numGen(15))
