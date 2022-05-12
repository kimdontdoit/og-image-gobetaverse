import { IncomingMessage } from "http";
import { parse } from "url";

export function parseRequest(req: IncomingMessage) {
  const { pathname, query } = parse(req.url || "/", true);
  const { backgroundImage, logo, images, titles, sep } = query || {};

  /*if (Array.isArray(theme)) {
    throw new Error("Expected a single theme");
  }*/

  const arr = (pathname || "/").slice(1).split(".");
  let extension = "";
  let text = "";

  if (titles) {
    text = "";
  } else if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: any = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    backgroundImage: backgroundImage,
    logo: logo,
    separator: sep,
    titles: getArray(titles),
    images: getArray(images),
  };

  return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): any {
  if (typeof stringOrArray === "undefined") {
    return false;
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  } else {
    return [stringOrArray];
  }
}
