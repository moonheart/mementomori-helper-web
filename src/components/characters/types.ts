import { CharacterMB, ElementType, JobFlags, UserCharacterDtoInfo } from '@/api/generated';

export interface UICharacter extends UserCharacterDtoInfo {
    master?: CharacterMB;
    name: string;
    element: ElementType;
    job: JobFlags;
}
