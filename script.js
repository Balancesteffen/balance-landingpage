const form = document.getElementById("lead-form");
const message = document.getElementById("form-message");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');

    message.textContent = "";
    message.className = "form-message";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      consent: formData.get("consent") === "on",
    };

    submitButton.disabled = true;
    submitButton.textContent = "Wird übermittelt …";

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Die Anfrage konnte nicht übermittelt werden."
        );
      }

      message.textContent =
        result.message || "Vielen Dank. Wir melden uns bei dir.";
      message.classList.add("success");

      form.reset();
    } catch (error) {
      console.error(error);

      message.textContent =
        error.message ||
        "Die Anfrage konnte nicht übermittelt werden. Bitte später erneut versuchen.";

      message.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Informationen anfordern";
    }
  });
}
