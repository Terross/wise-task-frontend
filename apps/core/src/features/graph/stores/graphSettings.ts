import { defineStore } from "pinia";
import {
  DEFAULT_CIRCLE_PADDING,
  DRAW_SPACING_X,
  DRAW_SPACING_Y,
} from "@/features/graph/config/drawParams";

interface GraphSettingsStore {
  edgeType: "Bezie" | "Straight" | "Step";
  defaultNodeSize: number;
  defaultNodeSpacingX: number;
  defaultNodeSpacingY: number;
  defaultCirclePadding: number;
}

const useGraphSettings = defineStore("graphSettings", {
  state: (): GraphSettingsStore => ({
    edgeType: "Bezie",
    defaultNodeSize: 100,
    defaultNodeSpacingX: DRAW_SPACING_X,
    defaultNodeSpacingY: DRAW_SPACING_Y,
    defaultCirclePadding: DEFAULT_CIRCLE_PADDING,
  }),
});

export const graphSettingsStore = useGraphSettings();
