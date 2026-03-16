import type { Context } from "./Context.ts";
import { render } from "./render.ts";

const defaultTitle = document.title;

const titleMap: Partial<Record<Context["mode"], string>> = {
  "light": `${defaultTitle} in a paper map style`,
  "vintage": `${defaultTitle} in a vintage style`,
  "fantasy": `${defaultTitle} in a fantasy style`,
};

function getMode(url: string) {
  return new URL(url).searchParams.get("mode") as Context["mode"];
}

export function initControls(ctx: Context) {
  let modeSwitch = document.querySelector("#screen .mode.switch")!;

  function setActiveMode(mode: Context["mode"], skipRender = false) {
    for (let control of modeSwitch.querySelectorAll("a"))
      control.dataset.active = String(getMode(control.href) === mode);

    document.documentElement.dataset.mode = mode;
    document.title = titleMap[mode] ?? defaultTitle;

    if (!skipRender) {
      ctx.mode = mode;
      render(ctx);

      window.sendEvent?.(["set mode", mode]);
    }
  }

  modeSwitch.addEventListener("click", (event) => {
    let control = (event.target as HTMLElement | null)?.closest("a");

    if (control && window.history) {
      event.preventDefault();

      let nextMode = getMode(control.href);

      if (ctx.mode !== nextMode) {
        window.history.pushState({}, "", control.href);
        setActiveMode(nextMode);
      }
    }
  });

  window.addEventListener("popstate", () => {
    setActiveMode(getMode(window.location.href));
  });

  setActiveMode(ctx.mode, true);
}
