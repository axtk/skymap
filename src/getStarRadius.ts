import type { Context } from "./Context.ts";
import type { Star } from "./Star.ts";

export function getStarRadius(star: Star, { mode }: Context) {
  if (mode === "fantasy") return 2 * (6.75 - star.magnitude);

  if (mode === "light" || mode === "vintage")
    return 0.6 * (6.75 - star.magnitude);

  return 0.7 * (6.75 - star.magnitude);
}
