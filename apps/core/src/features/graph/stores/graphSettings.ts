import { defineStore } from "pinia";
import {
  DEFAULT_CIRCLE_PADDING,
  DRAW_SPACING_X,
  DRAW_SPACING_Y,
} from "@/features/graph/config/drawParams";

export const graphSettings = defineStore("graphSettings", {
  state: () => ({
    edgeType: "Bezie",
    defaultNodeSize: 100,
    defaultNodeSpacingX: DRAW_SPACING_X,
    defaultNodeSpacingY: DRAW_SPACING_Y,
    defaultCirclePadding: DEFAULT_CIRCLE_PADDING,
  }),
});
