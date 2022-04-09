import { readFileSync } from "fs";
import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";

const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);


const fontMed= readFileSync(
  `${__dirname}/../_fonts/FuturaPT-Medium.woff2`
).toString("base64");

const fontBold = readFileSync(
  `${__dirname}/../_fonts/FuturaPT-Heavy.woff2`
).toString("base64");

function getCss(theme: string, fontSize: string, backgroundImage: string) {
  let foreground = "#e2e4e9";
  let baseFontSize = sanitizeHtml(fontSize);

  if (theme === "dark") {
    foreground = "#e2e4e9";
  }

  return `
   @font-face {
      font-family: 'Futura';
      font-style:  normal;
      font-weight: 500;
      src: url(data:font/woff2;charset=utf-8;base64,${fontMed}) format('woff2')
    }

    @font-face {
        font-family: 'Futura';
        font-style:  normal;
        font-weight: 700;
        src: url(data:font/woff2;charset=utf-8;base64,${fontBold}) format('woff2')
    }

    body {
      display: flex;
      height: 100vh;
      background-image: url('${backgroundImage}');
      background-size: cover;
      font-family: 'Futura', sans-serif;
      font-size: ${baseFontSize};
    }
    
    .wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .league-logo {
      margin-bottom: 48px;
    }

    .league-logo span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 192px;
        height: 192px;
    }

    .league-logo img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .logo {
      position: absolute;
      top: 120px;
      left: 120px;
      width: 490px;
    }

    .heading {
        font-size: 150px;
        font-style: normal;
        color: ${foreground};
        font-weight: 700;
        margin-bottom: 48px;
    }
    
    .button {
      display: block
      border-radius: 9999px;
      background: #dcff85;
      color: #0e1015;
      padding: 32px;
      font-weight: 500;
    }

    img {
      max-width: 100%;
      height: auto;
      margin: 0;
    }

    p {
      margin: 0;
    }
    `;
}

export function getHtml(parsedReq: any) {
  const {
    text,
    theme,
    md,
    fontSize,
    images,
    widths,
    heights,
    backgroundImage,
    logo
  } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, backgroundImage)}
    </style>
    <body>

      <div class="logo">
          <img
            alt="Generated Image"
            src="${sanitizeHtml(logo)}"
          />
      </div>

      ${images && `<div class="wrapper">
          <div class="league-logo">
              <span>
                  ${images
                    .map(
                      (img: string, i: number) =>
                        getPlusSign(i) + getImage(img, widths[i], heights[i])
                    )
                    .join("")}
              </span>
          </div>`}

          ${text && `<div class="heading">${emojify(
            md ? marked(text) : sanitizeHtml(text)
          )}
          </div>`}
      </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
