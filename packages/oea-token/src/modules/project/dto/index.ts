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

export class TokenDTO {
  @IsString()
  tokenId: string;

  @IsString()
  address: string;

  constructor(tokenId: string, address: string) {
    this.tokenId = tokenId;
    this.address = address;
  }
}
