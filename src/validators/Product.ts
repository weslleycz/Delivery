import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateProductDTO {
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    name!: string;

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsNumber()
    price!: number;

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    description!: string;

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    type!: string;

    @IsOptional()
    @IsString()
    discount!: string;

    @IsOptional()
    @IsArray()
    imagens!: string[];
}

export class UpdateProductDTO {
    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @IsNumber()
    price!: number;

    @IsOptional()
    @IsString()
    description!: string;

    @IsOptional()
    @IsString()
    type!: string;

    @IsOptional()
    @IsString()
    discount!: string;

    @IsOptional()
    @IsArray()
    imagens!: string[];
}

