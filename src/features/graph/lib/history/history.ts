import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { Restore } from "@/features/graph/types/restores";
import { RestoreObjectFactory } from "@/features/graph/lib/history/factory";
import { NodesStoreState } from "@/features/graph/types/NodesStore";

class History {
  private restores: RestoreObject[] = [];
  private readonly MAX_HISTORY_LENGTH: number = 100;

  public constructor() {}

  public onStateUpdate = (restore: Restore) => {
    this.restores.push(RestoreObjectFactory.create(restore));
    if (this.restores.length > this.MAX_HISTORY_LENGTH) {
      this.restores.shift();
    }
  };

  public undo = (state: NodesStoreState): NodesStoreState => {
    const restoreObject: RestoreObject | undefined = this.restores.pop();
    if (!restoreObject) {
      return state;
    }
    return restoreObject.restore(state);
  };
}

export const history: History = new History();
