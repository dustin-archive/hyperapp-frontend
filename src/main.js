import { app, h } from 'hyperapp'

// Helpers
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

// Mixins
const Router = {
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
    go (state, _, { query, route }) {
      window.location.hash = (route || state.route) + queryEncode(query || state.query)
    }
  },
  events: {
    load (state, { go, init }) {
      init()

      window.onhashchange = () => {
        init()
      }

      // Testing
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
  }
}

// Views
const Home = ({ state, actions }, children) =>
  h('div', null, 'home is where i live')

const About = () =>
  h('div', null, 'about')

const Contact = () =>
  h('div', null, 'contact')

const Howdy = ({ state, actions }) =>
  h('div', null, JSON.stringify(state))

const Honky = ({ state, actions }) =>
  h('div', null, JSON.stringify(state))

const NotFound = () =>
  h('div', null, '404')

const RouterView = ({ state, actions }) => {
  switch (state.route) {
    case '/':
      return h(Home, { state, actions })
    case '/about':
      return h(About)
    case '/contact':
      return h(Contact)
    case '/howdy':
      return h(Howdy, { state, actions })
    case '/honky':
      return h(Honky, { state, actions })
    default:
      return h(NotFound)
  }
}

const RouterLink = ({ state, actions, to }, children) =>
  h('a', {
    onclick () {
      actions.go({ route: to })
    }
  }, children)

// App
app({
  mixins: [
    Router
  ],
  view: (state, actions) => {
    const Component = (tag, data, children) =>
      h(tag, Object.assign(data, { state, actions }), children)

    // view
    return h('ul', null, [
      h('li', null, [
        h('div', {
          onclick () {
            actions.go({ route: '/honky' })
          }
        }, 'go to honky')
      ]),
      h('li', null, [
        Component(RouterLink, { to: '/home' }, 'go home')
      ]),
      h('li', null, [
        h('a', { href: '#/howdy' }, 'go howdy')
      ]),
      RouterView({ state, actions })
    ])
  }
})
