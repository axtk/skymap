import type { Context } from "./Context.ts";
import { render } from "./render.ts";

function getMode(control: HTMLAnchorElement) {
  return new URL(control.href).searchParams.get("mode") as Context["mode"];
}

export function renderControls(ctx: Context) {
  let modeSwitch = document.querySelector("#screen .mode.switch")!;

  function setActiveMode() {
    for (let control of modeSwitch.querySelectorAll("a"))
      control.dataset.active = String(getMode(control) === ctx.mode);
  }

  modeSwitch.addEventListener("click", (event) => {
    let control = (event.target as HTMLElement | null)?.closest("a");

    if (control && window.history) {
      event.preventDefault();

      let nextMode = getMode(control);

      if (ctx.mode !== nextMode) {
        document.documentElement.dataset.mode = nextMode;
        ctx.mode = nextMode;

        window.history.pushState({}, "", `?mode=${nextMode}`);
        setActiveMode();
        render(ctx);

        window.sendEvent?.(["set mode", nextMode]);
      }
    }
  });

  setActiveMode();
}
