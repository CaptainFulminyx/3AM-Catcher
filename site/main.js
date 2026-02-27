// ── Live clock ──
function updateClock() {
  const el = document.getElementById('navTime')
  if (!el) return
  const now = new Date()
  el.textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  })
}
updateClock()
setInterval(updateClock, 1000)

// ── Scroll-reveal for cards ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80)
      observer.unobserve(entry.target)
    }
  })
}, {
  threshold: 0.1
})

document.querySelectorAll('.thought-card').forEach(card => observer.observe(card))

// ── Reaction toggles (demo) ──
function toggleReaction(btn, type) {
  const card = btn.closest('.card-reactions')
  const countEl = btn.querySelector('span')
  const count = parseInt(countEl.textContent)
  const activeClass = `active-${type}`
  const isActive = btn.classList.contains(activeClass)

  // remove all active states in this card
  card.querySelectorAll('.reaction').forEach(r => {
    const t = r.dataset.rtype
    if (r !== btn) {; ['active-felt',
      'active-wantIn',
      'active-tellMore'].forEach(c => r.classList.remove(c))
    }
  })

  if (isActive) {
    btn.classList.remove(activeClass)
    countEl.textContent = count - 1
  } else {
    btn.classList.add(activeClass)
    countEl.textContent = count + 1
  }
}

// ── Email form (hero) ──
function handleSubmit(e) {
  e.preventDefault()
  // TODO: POST email to your backend / Supabase / Formspree
  const email = document.getElementById('emailInput').value
  console.log('TODO: save email →', email)
  document.getElementById('emailForm').style.display = 'none'
  document.getElementById('successMsg').style.display = 'block'
}
