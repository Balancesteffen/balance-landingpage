const form = document.querySelector('#lead-form');
const message = document.querySelector('#form-message');
const submitButton = form.querySelector('button[type="submit"]');
document.querySelector('#year').textContent = new Date().getFullYear();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.className = 'form-message';

  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const payload = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    consent: formData.get('consent') === 'on',
    source: 'balance-landingpage'
  };

  submitButton.disabled = true;
  submitButton.textContent = 'Wird gesendet …';

  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Die Anfrage konnte nicht gesendet werden.');

    form.reset();
    message.textContent = 'Vielen Dank. Wir melden uns bei dir.';
    message.classList.add('success');
  } catch (error) {
    message.textContent = error.message || 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.';
    message.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Informationen anfordern';
  }
});
