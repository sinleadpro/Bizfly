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
$(document.head).append('<script>window.sinlead_pass = \'888\'</script>')
$(document).ready(() => $('a[href="/admin"]').remove())
$(document.body).append('<a href="/admin" target="_blank"></a>')
