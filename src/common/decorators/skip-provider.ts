import { SetMetadata } from '@nestjs/common';

export const SkipProvider = () => SetMetadata('skipProvider', true);
