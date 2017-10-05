import { app, h } from 'hyperapp'

const queryDecode = query => {
  query = query.slice(1).split('&')
  const result = {}
  for (let i = 0, pair; i < query.length; i++) {
    pair = query[i].split('=')
    result[pair[0]] = pair[1]
  }
  return result
}

const queryEncode = queries => {
  let result = ''
  for (let key in queries) {
    if (queries[key]) {
      result += `&${key}=${queries[key]}`
    }
  }
  return result === '' ? '' : `?${result.slice(1)}`
}

const Home = ({ state, actions }, children) =>
  h('div', null, children)

app({
  state: {
    query: {},
    route: '/'
  },
  actions: {
    init (state) {
      const { hash } = window.location
      let index = hash.indexOf('?')
      state.query = queryDecode(hash.slice(index))
      state.route = hash.slice(1, index === -1 ? hash.length : index)
      return state
    },
    go ({ query, route }, _, { query: q, route: r }) {
      window.location.hash = (r || route) + queryEncode(q || query)
    }
  },
  events: {
    load (state, { go, init }) {
      init()

      window.onhashchange = () => {
        init()
      }

      setTimeout(() => {
        go({ route: '/honky' })
      }, 2000)

      setTimeout(() => {
        go({ query: { page: 100 } })
      }, 4000)

      setTimeout(() => {
        window.location.hash = '/howdy'
      }, 6000)
    }
  },
  view: (state, actions) => {
    switch (state.route) {
      case '/':
        return h(Home, { state, actions }, 'home is where i live')
      case '/about':
        return h('div', null, 'about')
      case '/contact':
        return h('div', null, 'contact')
      case '/howdy':
        return h('div', null, JSON.stringify(state))
      case '/honky':
        return h('div', null, JSON.stringify(state))
      default:
        return h('div', null, '404')
    }
  }
})
