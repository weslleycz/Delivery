import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber
} from "class-validator";

enum CaymentMethodEnum {
    Money = "Money",
    Card = "Card",
}

class IProductDTO {
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    id?: string;

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsNumber()
    quantity?: number;
}

export class CreateOrderDTO {
    @IsEnum(CaymentMethodEnum)
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    caymentMethod!: CaymentMethodEnum;

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsArray()
    productsCard!: IProductDTO[];

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    addressId?: string;

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    idRestaurant?: string;

    @IsOptional()
    @IsString()
    mensagem?: string;
}
