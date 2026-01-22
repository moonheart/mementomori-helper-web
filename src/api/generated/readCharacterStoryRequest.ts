/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ApiRequestBase } from "./apiRequestBase";
import { MemoryLogType } from "./memoryLogType";

export class ReadCharacterStoryRequest extends ApiRequestBase {
    characterStoryId: number;
    isSkip: boolean;
    memoryLogType: MemoryLogType;
}
