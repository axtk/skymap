import type { Context } from "./Context.ts";
import { getDimensions } from "./getDimensions.ts";
import { hideMenu } from "./hideMenu.ts";
import { render } from "./render.ts";
import { setDragPan } from "./setDragPan.ts";
import { state } from "./state.ts";
import { toBounds } from "./toBounds.ts";

const { PI, asin } = Math;

export function initNavigation(ctx: Context) {
  let { element: container } = ctx;

  setDragPan(container, {
    onStart() {
      ctx.moving = true;
      hideMenu();
    },
    onMove(dx, dy) {
      let { tilt } = ctx;
      let { r } = getDimensions(ctx);

      let dPhi = asin(dx / r);
      let dTheta = asin(dy / r);

      let nextPhi = tilt[0] - dPhi;
      let nextTheta = tilt[1] - dTheta;

      tilt[0] = toBounds(nextPhi);

      if (nextTheta >= -PI / 2 && nextTheta <= PI / 2) tilt[1] = nextTheta;

      render(ctx);
    },
    onEnd() {
      ctx.moving = false;

      requestAnimationFrame(() => {
        state.write("tilt", ctx.tilt);
        // render with `ctx.moving = false`
        render(ctx);
      });
    },
    wheel: true,
  });
}
