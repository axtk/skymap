import type { Constellation } from "./Constellation.ts";
import type { Context } from "./Context.ts";
import { ns } from "./const.ts";
import { escapeHTML } from "./escapeHTML.ts";
import { getScreenPosition } from "./getScreenPosition.ts";

const multilineLabels = new Set(["CrA", "CrB", "TrA"]);

function getContent(ctx: Context, data: Constellation) {
  let { abbr, name } = data;

  if (ctx.mode === "vintage") name = name.replaceAll("u", "v");

  if (multilineLabels.has(abbr)) {
    let lines = name.split(" ");
    let content = "";

    for (let line of lines) {
      let s = escapeHTML(line);

      content += content === ""
        ? `<tspan x="0">${s}</tspan>`
        : `<tspan x="0" dy="1.1em">${s}</tspan>`;
    }

    return content;
  }

  return escapeHTML(name);
}

export function renderConstellationLabels(ctx: Context) {
  let container = ctx.element.querySelector("g.constellation-labels")!;
  let labels = Array.from(container.querySelectorAll("text"));
  let fragment: DocumentFragment | null = null;

  let item: Constellation;
  let element: SVGTextElement;
  let pos: [number, number, number] | null;
  let k = 0;

  for (let i = 0; i < ctx.constellations.length; i++) {
    item = ctx.constellations[i];

    if (!item.name) continue;

    pos = getScreenPosition(item.label.ra, item.label.dec, ctx);

    if (pos === null) continue;

    element = labels[k++];

    if (!element) {
      if (!fragment) fragment = document.createDocumentFragment();

      element = document.createElementNS(ns, "text");
      element.setAttribute("x", "0");
      element.setAttribute("y", "0");
      fragment.appendChild(element);
    }

    element.style = `--x: ${pos[0].toFixed(3)}px; --y: ${pos[1].toFixed(3)}px;`;
    element.innerHTML = getContent(ctx, item);
  }

  if (fragment) container.appendChild(fragment);

  for (let i = k; i < labels.length; i++) labels[i].remove();
}
