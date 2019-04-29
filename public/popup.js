function setAdmin(urlString) {
  if (!urlString) { return }
  const url = new URL(urlString)
  if (!url.pathname.match(/^\/admin/)) { return }
  const panel = $('#admin')
  panel.html(`
    <div>
      <input type="checkbox" disabled checked>
      Stop open new tab (products/customers/orders)
    </div>
  `)
  return 'admin'
}

function setCheckoutFormInfo(info) {
  if (!info || info.length == 0) { return }
  var p = $('#checkout-info')
  var t = $('<table><tbody></tbody></table>')
  var tb = t.find('tbody')
  var h = {}
  info.forEach(function(i) {
    h[i.name] = i.value
  })
  Object.keys(h).forEach(function(k) {
    tb.append($('<tr><td>' + k + '</td><td>' + h[k]  + '</td></tr>'))
  })
  p.html(t)
  return 'checkout'
}

function setShopId(assetLink, domainUrl) {
  if (!assetLink) { return }
  const url = new URL(domainUrl)
  var t = $('#shop-id')
  var r = assetLink.match(/\/(\d+)\/theme\/(\d+)/)
  var shopId = r[1]
  var themeId = r[2]
  t.html(`
    <a href="${url.origin}/admin" target="_blank">
      <button class="btn btn-default btn-lg">
        Go To Admin
        <i class="far fa-paper-plane"></i>
      </button>
    </a>
    <h2>Shop Id: ${shopId}</h2>
    <h2>Theme Id: ${themeId}</h2>
    <h3>data/shops/${shopId}/themes/${themeId}</h3>
  `)
  return 'shop'
}

chrome.tabs.query({
  active: true,
  currentWindow: true,
}, tabs => {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { from: 'popup', subject: 'formInfo' },
    (data = {}) => {
      const tabs = []
      tabs.push(setAdmin(data.url))
      tabs.push(setCheckoutFormInfo(data.info))
      tabs.push(setShopId(data.link, data.url))
      const tab = tabs.find(e => !!e)
      if (tab) { $(`.tab-item[data-tab-name="${tab}"] > a`).tab('show') }
    },
  )
})

$(document).ready(() => {
  const navTabs = $('ul.nav-tabs')
  const TABS_KEY = 'bizfly:tabs'
  const tabNames = `${localStorage.getItem(TABS_KEY)}`.split(',')
  tabNames.forEach(name => {
    const tab = navTabs.find(`[data-tab-name="${name}"]`)
    if (tab) { navTabs.prepend(tab) }
  })
  navTabs.sortable().on('sortchange', () => {
    const tabNames = []
    navTabs.children('.tab-item').each((index, element) => {
      tabNames.push(element.dataset.tabName)
    })
    localStorage.setItem(TABS_KEY, tabNames)
  })
})
