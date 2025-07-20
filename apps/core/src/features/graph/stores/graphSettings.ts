import { defineStore } from "pinia";
import {
  DEFAULT_CIRCLE_PADDING,
  DRAW_SPACING_X,
  DRAW_SPACING_Y,
} from "@/features/graph/config/drawParams";
import {
  BACKGROUND_DEFAULT_COLOR,
  BACKGROUND_DEFAULT_GAP,
  BACKGROUND_DEFAULT_SIZE,
  BACKGROUND_DEFAULT_TYPE,
} from "@/features/graph/config/backgroundParams";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";
import { EDGE_DEFAULT_TYPE } from "@/features/graph/config/edgeDefaultSettings";

interface GraphSettingsStore {
  edgeType: "Bezie" | "Straight" | "Step";
  defaultNodeSize: number;
  defaultNodeSpacingX: number;
  defaultNodeSpacingY: number;
  defaultCirclePadding: number;
  patternType: "dots" | "lines";
  patternGap: number;
  patternSize: number;
  patternColor: string;
  isOneHandle: boolean;
}

const STORAGE_KEY: string = "graphSettings";

const getDefaultSettings = (): GraphSettingsStore => ({
  edgeType: EDGE_DEFAULT_TYPE,
  defaultNodeSize: DEFAULT_NODE_SIZE.width,
  defaultNodeSpacingX: DRAW_SPACING_X,
  defaultNodeSpacingY: DRAW_SPACING_Y,
  defaultCirclePadding: DEFAULT_CIRCLE_PADDING,
  patternType: BACKGROUND_DEFAULT_TYPE,
  patternGap: BACKGROUND_DEFAULT_GAP,
  patternSize: BACKGROUND_DEFAULT_SIZE,
  patternColor: BACKGROUND_DEFAULT_COLOR,
  isOneHandle: false,
});

const loadSettings = (): GraphSettingsStore => {
  const saved: string | null = localStorage.getItem(STORAGE_KEY);
  const defaultSettings = getDefaultSettings();

  if (saved) {
    try {
      const parsedSettings: GraphSettingsStore = JSON.parse(saved);
      return { ...defaultSettings, ...parsedSettings };
    } catch (e) {
      console.error("Error parsing saved graph settings, loading defaults.", e);
      return defaultSettings;
    }
  }
  return defaultSettings;
};

const useGraphSettings = defineStore("graphSettings", {
  state: (): GraphSettingsStore => loadSettings(),
  actions: {
    saveToLocalStorage(): void {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state));
    },
    resetToDefaults(): void {
      Object.assign(this.$state, getDefaultSettings());
      this.saveToLocalStorage();
    },
  },
});

export const graphSettingsStore = useGraphSettings();
