import { IsString, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'Codigo de usuário não pode ser vazio' })
  @IsString({ message: 'Codigo de usuário precisa ser uma texto' })
  userCode: string;
}
