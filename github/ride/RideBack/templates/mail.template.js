let emailTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{{title}}</title>
  </head>
  <body
    style="background-color: #ffffff; color: #333; margin: 0px; padding: 0px"
  >
    <div
      style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
      "
    >
      <div style="display: flex; margin-bottom: 30px; gap: 20px">
        <img
          src="https://quick-ride-asif.vercel.app/logo-quickride.png"
          alt="QuickRide"
          style="margin: 0px auto; height: 60px"
        />
      </div>

      <h2 style="margin-top: 0">{{title}}</h2>
      <p>Hi {{name}},</p>

      <p style="text-wrap: pretty;">{{message}}</p>
      <div style="display: flex; width: 100%">
        <a
          href="{{cta_link}}"
          target="_blank"
          style="
            display: inline-block;
            text-align: center;
            margin: 10px auto;
            padding: 18px 36px;
            background-color: #51d56b;
            text-decoration: none;
            font-size: 18px;
            font-weight: bold;
            border-radius: 6px;
            color: #ffffff;
          "
        >
          {{cta_text}}
        </a>
      </div>
      <p style="text-wrap: pretty;">{{note}}</p>

      <div
        style="
          font-size: 13px;
          color: #777;
          margin-top: 30px;
          text-align: center;
        "
      >
        &mdash; The QuickRide Team
        <br />
        <small>
          If you have any questions or need help, feel free to reach out to our
          team at
          <a href="mailto:{{support_email}}" style="color: #4caf50"
            >{{support_email}}</a
          >
        </small>
      </div>
    </div>
  </body>
</html>

`;
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHttpUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? escapeHtml(url.href) : "#";
  } catch {
    return "#";
  }
}

const fillTemplate = (data, template = emailTemplate) => {
  return template
    .replace(/{{title}}/g, escapeHtml(data.title || ""))
    .replace(/{{name}}/g, escapeHtml(data.name || "there"))
    .replace(/{{message}}/g, escapeHtml(data.message || ""))
    .replace(/{{cta_link}}/g, safeHttpUrl(data.cta_link || ""))
    .replace(/{{cta_text}}/g, escapeHtml(data.cta_text || "Click Here"))
    .replace(/{{note}}/g, escapeHtml(data.note || ""))
    .replace(/{{support_email}}/g, escapeHtml(process.env.RESEND_EMAIL_FROM || ""));
};

module.exports = { emailTemplate, fillTemplate };
