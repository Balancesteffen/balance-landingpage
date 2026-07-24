export async function onRequestPost(context) {
  const { request, env } = context;

  const jsonResponse = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Cache-Control": "no-store",
      },
    });

  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return jsonResponse(
        { success: false, message: "Ungültiges Anfrageformat." },
        415
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const consent = body.consent === true;

    if (!name || !email || !phone || !consent) {
      return jsonResponse(
        {
          success: false,
          message: "Bitte alle Pflichtfelder ausfüllen und der Kontaktaufnahme zustimmen.",
        },
        400
      );
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return jsonResponse(
        { success: false, message: "Bitte eine gültige E-Mail-Adresse eingeben." },
        400
      );
    }

    if (!env.SMARTLEAD_API_KEY || !env.SMARTLEAD_CAMPAIGN_ID) {
      console.error("Smartlead-Secrets fehlen.");
      return jsonResponse(
        { success: false, message: "Das Formular ist momentan nicht verfügbar." },
        500
      );
    }

    const nameParts = name.split(/\s+/);
    const firstName = nameParts.shift() || name;
    const lastName = nameParts.join(" ");

    const smartleadResponse = await fetch(
      `https://server.smartlead.ai/api/v1/campaigns/${encodeURIComponent(
        env.SMARTLEAD_CAMPAIGN_ID
      )}/leads?api_key=${encodeURIComponent(env.SMARTLEAD_API_KEY)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead_list: [
            {
              email,
              first_name: firstName,
              last_name: lastName,
              phone_number: phone,
              custom_fields: {
                source: "balance-worldwide.de",
              },
            },
          ],
          settings: {
            ignore_global_block_list: false,
            ignore_unsubscribe_list: false,
            ignore_duplicate_leads_in_other_campaign: false,
          },
        }),
      }
    );

    const result = await smartleadResponse.json().catch(() => null);

    if (!smartleadResponse.ok) {
      console.error("Smartlead-Fehler:", smartleadResponse.status, result);

      return jsonResponse(
        {
          success: false,
          message:
            "Die Anfrage konnte nicht übermittelt werden. Bitte später erneut versuchen.",
        },
        502
      );
    }

    return jsonResponse({
      success: true,
      message: "Vielen Dank. Wir melden uns bei dir.",
    });
  } catch (error) {
    console.error("Formularfehler:", error);

    return jsonResponse(
      {
        success: false,
        message:
          "Die Anfrage konnte nicht übermittelt werden. Bitte später erneut versuchen.",
      },
      500
    );
  }
}

export function onRequest(context) {
  return new Response(
    JSON.stringify({
      success: false,
      message: "Methode nicht erlaubt.",
    }),
    {
      status: 405,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Allow: "POST",
      },
    }
  );
}

