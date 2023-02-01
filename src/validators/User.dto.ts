import { Match } from "@/decorators/match.decorator";
import { IsCPF } from "brazilian-class-validator";
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({ message: "Você precisa informar o seu email" })
    @IsString()
    @IsEmail({}, { message: "Este não é um e-mail" })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    @MinLength(8, {
        message: "Uma senha forte deve conter no mínimo 8 caracteres",
    })
    @MaxLength(20, {
        message: "Uma senha forte deve conter no máximo 20 caracteres",
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "Senha muito fraca",
    })
    password!: string;

    @IsString()
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @MinLength(8)
    @MaxLength(20)
    @Match("password", {
        message: "As senhas não correspondem",
    })
    passwordConfirm!: string;

    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    @IsString()
    @IsCPF({ message: "Número de CPF inválido" })
    cpf!: string;

    @IsString()
    @IsNotEmpty({ message: "Esse campo e obrigatório" })
    name!: string;
}
