import '../specHelper'
import * as module from '../../src/search/SearchActions'
import { initialState } from '../../src/search/SearchReducer'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Immutable from 'immutable'
import nock from 'nock'
import reducer from '../../src/reducers/main'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const requestBody = JSON.stringify({queries: [{type: 'queryText', value: 'alaska'}], filters: []})

describe('The search action', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  it('triggerSearch executes a search from requestBody', () => {

    nock.disableNetConnect()

    const testingRoot = 'http://localhost:9090'

    nock(testingRoot)
        .post('/api/search', requestBody)
        .reply(200, {
          data: [
            {
              type: 'collection',
              id: '123ABC',
              attributes: {
                field0: 'field0',
                field1: 'field1'
              }
            },
            {
              type: 'collection',
              id: '789XYZ',
              attributes: {
                field0: 'field00',
                field1: 'field01'
              }
            }
            ]
        })
    const testSearchState = initialState.mergeDeep({requestBody: requestBody})
    const initState = reducer(Immutable.Map(), {type: 'init'})
    const testState = initState.mergeDeep({search: testSearchState})

    const expectedItems = new Map()
    expectedItems.set("123ABC", {type: 'collection', field0: 'field0', field1: 'field1'})
    expectedItems.set("789XYZ", {type: 'collection', field0: 'field00', field1: 'field01'})

    const expectedActions = [
      {type: module.SEARCH},
      {type: '@@router/CALL_HISTORY_METHOD', payload: {
        args: ['results?filters=%5B%5D&queries=%5B%7B%22type%22%3A%22queryText%22%2C%22value%22%3A%22alaska%22%7D%5D'],
        method: 'push'}
      },
      {type: module.SEARCH_COMPLETE, items: expectedItems}
    ]

    const store = mockStore(Immutable.fromJS(testState))
    return store.dispatch(module.triggerSearch(null, testingRoot))
        .then(() => {
          store.getActions().should.deep.equal(expectedActions)
        })
  })

  it('triggerSearch executes a search from query params', () => {

    nock.disableNetConnect()

    const testingRoot = 'http://localhost:9090'

    nock(testingRoot)
        .post('/api/search', requestBody)
        .reply(200, {
          data: [
            {
              type: 'collection',
              id: '123ABC',
              attributes: {
                field0: 'field0',
                field1: 'field1'
              }
            },
            {
              type: 'collection',
              id: '789XYZ',
              attributes: {
                field0: 'field00',
                field1: 'field01'
              }
            }
          ]
        })

    const initState = reducer(Immutable.Map(), {type: 'init'})

    const expectedItems = new Map()
    expectedItems.set("123ABC", {type: 'collection', field0: 'field0', field1: 'field1'})
    expectedItems.set("789XYZ", {type: 'collection', field0: 'field00', field1: 'field01'})

    const expectedActions = [
      {type: module.SEARCH},
      {type: '@@router/CALL_HISTORY_METHOD', payload: {
        args: ['results?filters=%5B%5D&queries=%5B%7B%22type%22%3A%22queryText%22%2C%22value%22%3A%22alaska%22%7D%5D'],
        method: 'push'}
      },
      {type: module.SEARCH_COMPLETE, items: expectedItems}
    ]

    // Empty requestBody; params passed directly to triggerSearch
    const store = mockStore(Immutable.fromJS(initState))
    return store.dispatch(module.triggerSearch(requestBody, testingRoot))
        .then(() => {
          store.getActions().should.deep.equal(expectedActions)
        })
  })

  it('triggerSearch does not start a new search when a search is already in flight', () => {
    const testSearchState = initialState.mergeDeep({inFlight: true})
    const fullState = Immutable.fromJS({search: {}, facets: {}, results: {}, details: {}, routing: {}})
    const testState = fullState.mergeDeep({search: testSearchState})

    const store = mockStore(Immutable.fromJS(testState))
    return store.dispatch(module.triggerSearch())
        .then(() => {
          store.getActions().should.deep.equal([]) // No actions dispatched
        })
  })

  it('updateQuery sets searchText', () => {
    const action = module.updateQuery('bermuda triangle')
    const expectedAction = {type: module.UPDATE_QUERY, searchText: 'bermuda triangle'}

    action.should.deep.equal(expectedAction)
  })

  it('startSearch returns (like batman, but better)', () => {
    const action = module.startSearch()
    const expectedAction = {type: module.SEARCH}

    action.should.deep.equal(expectedAction)
  })

  it('completeSearch sets result items', () => {
    const items = {
      data: [
        {
          type: 'collection',
          id: 'dummyId',
          attributes: {importantInfo1: 'this is important', importantInfo2: 'but this is more important'}
        }
      ]
    }
    const action = module.completeSearch(items)
    const expectedAction = {type: module.SEARCH_COMPLETE, items: items}

    action.should.deep.equal(expectedAction)
  })
})