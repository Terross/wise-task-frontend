import {RestoreObject} from "@/features/graph/types/RestoreObject";
import {Restore} from "@/features/graph/types/restores";

class History {
    private restores: RestoreObject[] = []
    constructor() {
    }

    public onStateUpdate = (restore: Restore) => {

    }
}