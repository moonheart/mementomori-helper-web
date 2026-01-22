/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { MemberInfo } from "./memberInfo";
import { ICustomAttributeProvider } from "./iCustomAttributeProvider";
import { MemberTypes } from "./memberTypes";
import { EventAttributes } from "./eventAttributes";
import { MethodInfo } from "./methodInfo";
import { Type } from "./type";

export class EventInfo extends MemberInfo implements ICustomAttributeProvider {
    memberType: MemberTypes;
    attributes: EventAttributes;
    isSpecialName: boolean;
    addMethod: MethodInfo;
    removeMethod: MethodInfo;
    raiseMethod: MethodInfo;
    isMulticast: boolean;
    eventHandlerType: Type;
}
