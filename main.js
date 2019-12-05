console.log('Bizfly')

if (chrome && chrome.runtime) {
  chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
  })

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.from === 'popup' && msg.subject === 'formInfo') {
      const info = $('#main-content').serializeArray()
      const link = $('script[src*="/s/files/"]').prop('src')
      response({ info, link, url: location.toString() })
    } else if (msg.from === 'popup' && msg.subject === 'goToAdmin') {
      location.assign('/admin')
    }
  })
}

$(document.head).append('<style>a[href="/admin"]{display:none;}</style>')
if (location.host === 'www.testcyb.info') {
  $(document.head).append('<script>window.sinlead_pass = \'888\'</script>')
}
if (location.host.match(/\.testcyb\.info$/) && !location.protocol.match(/^https/)) {
  location.protocol = 'https'
}
if (!location.pathname.match(/\/admin/)) {
  $(document).ready(() => $('a[href="/admin"]').remove())
}
if (location.pathname.match(/\/admin\/themes\/\d+\/assets/)) {
  $('#assets-confirm-modal').remove()
}

document.addEventListener(
  'click',
  event => {
    const { target: element } = event
    const { tagName, target, href } = element
    if (tagName === 'A' && target === '_blank') {
      const url = new URL(href)
      if (/\/admin\/(products|orders|customers)\/\d+/.exec(url.pathname)) {
        event.preventDefault()
        event.stopPropagation()
        location = href
      }
    }
  },
  true
);
