import $ from 'jquery'

const strings = {
  sendError: 'Une erreur est survenue 💥, merci de réessayer',
  sendSuccess: 'Merci ! Je vous recontacte prochainement ! 👋'
}

// allow global jquery access for debbuging more easily
if (process.env.NODE_ENV === 'development') {
  window.jq = $
}

$(function () {
  const nav = document.getElementById('nav')

  // on scroll toggle nav shadow
  window.addEventListener('scroll', () => {
    const shouldShowDropShadow = window.scrollY > 10
    const boxShadowEnabled = !!nav.style.boxShadow
    if (boxShadowEnabled != shouldShowDropShadow) {
      nav.style.boxShadow = shouldShowDropShadow ? '0px 3px 6px 0px rgba(0,0,0,0.1)' : null
    }
  }, { capture: false, passive: true })

  // smooth scroll on elements with data-scrollto attribute
  $('[data-scrollto]').on('click', e => {
    e.preventDefault()
    const anchor = $(e.target).data('scrollto')
    const navHeight = nav.getBoundingClientRect().height
    const top = Math.max(0, $(anchor).offset().top - navHeight)
    $('html, body').stop().animate({ scrollTop: `${top}px` }, 300)
  })

  // perform an ajax call to google sheet
  // https://medium.com/@dmccoy/how-to-submit-an-html-form-to-google-sheets-without-google-forms-b833952cc175

  const form = $('form#subscribe')
  const sending = $('#sending')
  const sent = $('#sent')

  const email = $('form#subscribe #email')
  form.on('submit', e => {
    e.preventDefault()
    const mail = email.val()
    if (mail.length <= 0) { return email.focus() }

    const goBackAfterSecs = 2.5

    form.hide()
    sending.show()

    const finish = (err, res) =>  {
      if (err) {
        sent.text(strings.sendError)
      } else {
        sent.text(strings.sendSuccess)
        email.val('')
      }
      sending.hide()
      sent.show()
      setTimeout(() => {
        sent.hide()
        form.show()
      }, goBackAfterSecs * 1000)
    }

    $.ajax({
      url: 'https://script.google.com/macros/s/AKfycbwa3osxyonSZvn5QJ2u7IeMmtX8PaDAgHH9oN9IfHkf_mu5AvA/exec',
      method: 'POST',
      dataType: 'json',
      data: { email: mail, timestamp: new Date() }
    })
    .then(res => finish(null, res))
    .catch(err => finish(err))
  })
})
