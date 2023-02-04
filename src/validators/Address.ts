import { IsNotEmpty, IsString,IsNumber } from "class-validator";
import {IsCEP} from "brazilian-class-validator"

export class CreateAddressDTO {
    @IsString()
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    state!: string;

    @IsString()
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    city!: string;

    @IsString()
    @IsCEP({ message: "Número de CEP inválido" })
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    cep!: string;

    @IsString()
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    district!: string;

    @IsString()
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    street!: string;

    @IsNumber()
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    number!: number;

}