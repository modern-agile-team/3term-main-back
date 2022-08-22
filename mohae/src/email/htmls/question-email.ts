export function questionHtml(email, title, description) {
  return `<body style="background: #f5f5f5">
    <table align="center" cellpadding="0" cellspacing="0" width="700">
      <tr>
        <td align="center" style="padding: 40px 0 30px 0">
          <img
            src="https://d2ffbnf2hpheay.cloudfront.net/email/mohae.png?w=100"
            alt="Creating Email Magic"
            width="100"
            height="75"
            style="display: block"
          />
        </td>
      </tr>
      <tr>
        <td
          align="center"
          bgcolor="#ffffff"
          style="border-radius: 24px; padding: 20px"
        >
          <p style="font-size: 20px">작성자 : ${email}</p>
          <p style="font-size: 18px">제목 : ${title}</p>
          <p style="font-size: 14px">${description}</p>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px">
          <img
            src="https://mohaeproj.s3.amazonaws.com/question/1657612862109_modern-logo.png"
            alt="Creating Email Magic"
            width="25"
            height="25"
            align="center"
          />
            Modern Agile Team
        </td>
      </tr>
    </table>
  </body>`;
}
