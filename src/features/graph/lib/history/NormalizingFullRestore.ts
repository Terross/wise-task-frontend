import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { NormalizingRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";

export class NormalizingFullRestoreObject extends RestoreObject {
  private readonly prevState: NodesStoreState;

  constructor(properties: NormalizingRestore) {
    super(properties as Restore);
    this.prevState = this.prevState = JSON.parse(
      JSON.stringify(properties.properties.state),
    );
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    console.log("NORMALIZING RESTORE IS WORKING");
    return { ...this.prevState };
  };
}
