import { IsCEP } from "brazilian-class-validator";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

export class UpdateAddressDTO {
    @IsString()
    @IsOptional()
    state!: string;

    @IsString()
    @IsOptional()
    city!: string;

    @IsString()
    @IsCEP({ message: "Número de CEP inválido" })
    @IsOptional()
    cep!: string;

    @IsString()
    @IsOptional()
    district!: string;

    @IsString()
    @IsOptional()
    street!: string;

    @IsNumber()
    @IsOptional()
    number!: number;
}
