const nav = document.getElementById('nav')
window.addEventListener('scroll', (e) => {
  const shouldShowDropShadow = window.scrollY > 10
  const boxShadowEnabled = !!nav.style.boxShadow
  if (boxShadowEnabled != shouldShowDropShadow) {
    nav.style.boxShadow = shouldShowDropShadow ? '0px 3px 6px 0px rgba(0,0,0,0.1)' : null
  }
  
  if (window.scrollY > 10) {
    
  }
}, { capture: false, passive: true })