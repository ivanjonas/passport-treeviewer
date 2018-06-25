import test from 'tape'
import { transformMysqlData } from '../src/server/lib/data-transform'

test('transformMysqlData', t => {
  const sample1 = [{
    factory_node: { id: 1, node_name: 'First Factory', min: 10, max: 50 },
    child_node: { node_value: 10 }
  },
  {
    factory_node: { id: 1, node_name: 'First Factory', min: 10, max: 50 },
    child_node: { node_value: 20 }
  },
  {
    factory_node: { id: 1, node_name: 'First Factory', min: 10, max: 50 },
    child_node: { node_value: 30 }
  },
  {
    factory_node: { id: 1, node_name: 'First Factory', min: 10, max: 50 },
    child_node: { node_value: 40 }
  },
  {
    factory_node: { id: 1, node_name: 'First Factory', min: 10, max: 50 },
    child_node: { node_value: 50 }
  },
  {
    factory_node: { id: 2, node_name: 'Second Factory', min: 3, max: 30 },
    child_node: { node_value: 9 }
  },
  {
    factory_node: { id: 2, node_name: 'Second Factory', min: 3, max: 30 },
    child_node: { node_value: 18 }
  },
  {
    factory_node: { id: 2, node_name: 'Second Factory', min: 3, max: 30 },
    child_node: { node_value: 27 }
  }]

  const expectedResult1 = [{
    id: 1,
    factoryName: 'First Factory',
    min: 10,
    max: 50,
    nodes: [10, 20, 30, 40, 50]
  }, {
    id: 2,
    factoryName: 'Second Factory',
    min: 3,
    max: 30,
    nodes: [9, 18, 27]
  }]

  t.deepEqual(transformMysqlData(sample1), expectedResult1, 'basic test')

  const sample2 = [{
    factory_node: { id: 3, node_name: 'Factory Without Nodes', min: 3, max: 30 },
    child_node: { node_value: null }
  }]

  const expectedResult2 = [{
    id: 3,
    factoryName: 'Factory Without Nodes',
    min: 3,
    max: 30,
    nodes: []
  }]

  t.deepEqual(transformMysqlData(sample2), expectedResult2, 'factory without nodes')

  t.end()
})
