/**
 * NBA.png?
 * titles=Team 1
 * titles=Team 2
 *
 * images=https%3A%2F%2Fgobetaverse.com%2Fwp-content%2Fuploads%2F2022%2F04%2Fnba-logo-transparent-e1648847428957.png
 * backgroundImage=https%3A%2F%2Fgobetaverse.com%2Fwp-content%2Fuploads%2F2022%2F04%2Fog_image.png
 * logo=https%3A%2F%2Fgobetaverse.com%2Fwp-content%2Fuploads%2F2022%2F04%2Fgobetaverse_logo.png
 */

import { readFileSync } from "fs";
import { sanitizeHtml } from "./sanitizer";

const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const futuraMedium = readFileSync(
  `${__dirname}/../_fonts/FuturaPT-Medium.woff2`
).toString("base64");

const futuraHeavy = readFileSync(
  `${__dirname}/../_fonts/FuturaPT-Heavy.woff2`
).toString("base64");

function getCss(backgroundImage: string) {
  return `
   @font-face {
      font-family: 'Futura';
      font-style:  normal;
      font-weight: 500;
      src: url(data:font/woff2;charset=utf-8;base64,${futuraMedium}) format('woff2')
    }

    @font-face {
        font-family: 'Futura';
        font-style:  normal;
        font-weight: 700;
        src: url(data:font/woff2;charset=utf-8;base64,${futuraHeavy}) format('woff2')
    }

    body {
      display: flex;
      height: 100vh;
      background-image: url('${backgroundImage}');
      background-size: cover;
      font-family: 'Futura', sans-serif;
      font-size: '18px';
    }
    
    .wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .images {
      display: flex;
      flex-direction: row;
      margin-bottom: 48px;
    }

    .images .imageWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 192px;
        height: 192px;
    }

    .images img {
        max-height: 100%;
        max-width: 100%;
        min-width: 100px;
        object-fit: contain;
    }

    .images.multiple-images {
      margin-bottom: 64px;
    }
    .multiple-images .imageWrapper {
      margin-right: 32px;
    }

    .separator {
        font-size: 60px;
        color: #999ca3;
        font-weight: 700;
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
        color: #e2e4e9;
        font-weight: 700;
        margin-bottom: 48px;
    }

    .heading.titles {
      text-align: center;
      font-size: 100px;
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
  const { text, images, separator, backgroundImage, logo, titles } = parsedReq;

  return `<!DOCTYPE html>
    <html>
      <meta charset="utf-8">
      <title>Generated Image</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
          ${getCss(backgroundImage)}
      </style>
      <body>

        <div class="logo">
            <img
              src="${sanitizeHtml(logo)}"
            />
        </div>

        ${
          images &&
          `<div class="wrapper">
            <div class="images ${
              images.length > 1 ? "multiple-images" : "single-image"
            }">
              ${images.map((img: string) => getImage(img)).join("")}
            </div>`
        }

            ${
              titles
                ? `<div class="heading titles">${
                    titles[0] +
                    getSeparator(separator ? separator : "") +
                    titles[1]
                  }</div>`
                : text &&
                  `<div class="heading">${emojify(sanitizeHtml(text))}</div>`
            }
        </div>
      </body>
    </html>`;
}

function getImage(src: string) {
  return `<span class="imageWrapper"><img
        src="${sanitizeHtml(src)}"
    /></span>`;
}

function getSeparator(sep: string) {
  return '<div class="separator">' + sep + "</div>";
}
