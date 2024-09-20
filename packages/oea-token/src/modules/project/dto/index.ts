import { IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  constructor(name: string, address: string) {
    this.name = name;
    this.address = address;
  }
}
