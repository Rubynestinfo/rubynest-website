export async function onRequestPost(context) {
  try {
    const req = context.request;
    const form = await req.formData();
    const name = (form.get("Name") || "").toString().trim();
    const phone = (form.get("Phone") || "").toString().trim();
    const email = (form.get("Email") || "").toString().trim();
    const city = (form.get("City") || "").toString().trim();
    const source = (form.get("Source") || "").toString().trim();
    const project = (form.get("Project") || "").toString().trim();

    const lines = [
      "New Free Estimate Request:",
      "--------------------------------",
      `Name:   ${name}`,
      `Phone:  ${phone}`,
      `Email:  ${email}`,
      `City:   ${city}`,
      `Source: ${source}`,
      "",
      "Project Description:",
      project || "(not provided)",
      "",
      "— Sent from rubynest.ca quote form"
    ];
    const body = lines.join("\n");

    const payload = {
      personalizations: [{ to: [{ email: "info@rubynest.ca" }] }],
      from: { email: "no-reply@rubynest.ca", name: "RubyNest Website" },
      reply_to: email ? [{ email, name }] : undefined,
      subject: "New Free Estimate Request — RubyNest",
      content: [{ type: "text/plain", value: body }]
    };

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      console.log("MailChannels error", await resp.text());
    }

    return Response.redirect(new URL("/thank-you.html", req.url), 303);
  } catch (e) {
    console.log("Quote handler exception", e);
    return Response.redirect(new URL("/thank-you.html", context.request.url), 303);
  }
}