import { AssignmentType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
class IsFutureDate implements ValidatorConstraintInterface {
  validate(startTime: string, args: ValidationArguments) {
    return new Date(startTime) > new Date();
  }

  defaultMessage(args: ValidationArguments) {
    return 'startTime must be in the future';
  }
}

@ValidatorConstraint({ name: 'isAfterStartTime', async: false })
class IsAfterStartTime implements ValidatorConstraintInterface {
  validate(dueTime: string, args: ValidationArguments) {
    const { startTime } = args.object as CreateAssignmentDto;
    return new Date(dueTime) > new Date(startTime);
  }

  defaultMessage(args: ValidationArguments) {
    return 'dueTime must be later than startTime';
  }
}

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Validate(IsFutureDate)
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @Validate(IsAfterStartTime)
  @IsDateString()
  dueTime: string;

  @IsNotEmpty()
  @IsEnum(AssignmentType)
  assignmentType: AssignmentType;
}
