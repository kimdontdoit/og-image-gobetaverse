
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';

const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const futura = readFileSync(`${__dirname}/../_fonts/FuturaPT-Bold.woff2`).toString('base64');

function getCss(theme: string, fontSize: string, backgroundImage: string) {

    let foreground = '#e2e4e9';
    let baseFontSize = sanitizeHtml(fontSize);

    if (theme === 'dark') {
        foreground = 'white';
    }

    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Futura';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${futura}) format('woff2')
    }

    body {
        background-image: url('${backgroundImage}');
        background-size: cover;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-family: 'Futura', sans-serif;
        font-size: ${baseFontSize};
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        display: none;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-size: 170px;
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }`;
}

export function getHtml(parsedReq: any) {
    const { text, theme, md, fontSize, images, widths, heights, backgroundImage } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, backgroundImage)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images.map((img: string, i: number) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                ).join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
