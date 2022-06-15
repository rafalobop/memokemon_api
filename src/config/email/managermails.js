const nodemailer = require("nodemailer");
const fs = require("fs");
var path = require("path");

var exp = module.exports;

exp.sendEmail = async (objMail, template) => {
  var res = null;
  var html = "";

  try {
    var pathArray = [
      "src",
      "config",
      "email",
      "templatemail",
      template.name,
    ];

    var appDir =
      path.dirname(require.main.filename) +
      path.sep +
      path.relative(process.cwd(), path.join(...pathArray));

    html = fs.readFileSync(appDir, "utf8");
    for (let i = 0; i < template.param.length; i++) {
      while (html.indexOf("{{" + template.param[i].key + "}}") != -1) {
        html = html.replace(
          "{{" + template.param[i].key + "}}",
          template.param[i].value
        );
      }
    }
    while (html.indexOf("    ") != -1) {
      html = html.replace("    ", "");
    }
    while (html.indexOf("\r\n") != -1) {
      html = html.replace("\r\n", "");
    }
  } catch (err) {
    console.log('ERRR', err)
    html = "";
    for (let i = 0; i < template.length; i++) {
      html += "<br/>";
      html += template[i].key + ": " + template[i].value;
    }
  }
  objMail.html = html;

  await send(objMail, (objEmailSend) => {
    console.log("correo de registro enviado exitosamente");
    res = true; //true;
  }).catch((error) => {
    console.log("FAIL: correo de registro");
    console.log(error);
    res = false;
  });
  return res;
};

async function send(objMail, next) {
  transporter = await gettransporter();
  let info = await transporter.sendMail(objMail);

  next({
    messageId: info.messageId,
    preview: nodemailer.getTestMessageUrl(info),
  });
}

const gettransporter = async (production) => {
  let transporter = null;
  let testAccount = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  };
  let smtpHost = process.env.SMTP_HOST;
  let smtpPort = process.env.SMTP_PORT;

  if (production) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }
  return transporter;
};
