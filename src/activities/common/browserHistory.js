// (un)register observers to be run when the user goes back/fwd in the browser history
// nb: these aren't triggered by history.pushState or back/fwd with full page loading
let historyObservers = []

export function addHistoryObserver(cb) {
  historyObservers.push(cb)
}

export function removeHistoryObserver(cb) {
  historyObservers = historyObservers.filter(observer => observer !== cb)
}

window.onpopstate = event => historyObservers.forEach(cb => cb(event.state))
