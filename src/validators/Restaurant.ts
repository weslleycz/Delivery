import { IsNotEmpty, IsString,IsOptional } from "class-validator";
import {IsCNPJ} from "brazilian-class-validator"

export class CreateRestaurantDTO {
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    logo!: string;

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsCNPJ({ message: "Número de CNPJ inválido" })
    @IsString()
    cnpj!: string;

    @IsOptional()
    @IsString()
    idAddress!: string;
}

export class UpdateRestaurantDTO {
    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    logo!: string;

    @IsOptional()
    @IsCNPJ({ message: "Número de CNPJ inválido" })
    @IsString()
    cnpj!: string;

}