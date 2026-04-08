import type { ComputedRef, InjectionKey } from "vue";

export const graphCanColorKey: InjectionKey<ComputedRef<boolean>> =
  Symbol("graph-can-color");

export const graphNodeDraggingActiveKey: InjectionKey<ComputedRef<boolean>> =
  Symbol("graph-node-dragging-active");
