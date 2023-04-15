import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class TimesheetDto {
  @IsNotEmpty({ message: 'Hora registrada não pode ser vazio' })
  @IsNumber({}, { message: 'Hora registrada precisa ser um inteiro' })
  registred_hour: number;

  @IsNotEmpty({ message: 'Data registrada não pode ser vazio' })
  @IsString({ message: 'Data registrada precisa ser um texto' })
  registred_date: string;
}
