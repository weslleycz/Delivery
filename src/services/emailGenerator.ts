import Mailgen from "mailgen";

type IEmailBody = {
    link: string;
    title: string;
    logo: string;
    text: string;
    name: string | null | undefined;
    color:string
};

export const emailGenerator = ({
    link,
    title,
    logo,
    text,
    name,
    color
}: IEmailBody) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: name as string,
            link: link,
            logo: logo,
        },
    });

    const bodyEmail = {
        body: {
            name: name as string,
            intro: "Compra realizada com sucesso.",
            action: {
                instructions: text,
                button: {
                    color: color,
                    text:  title,
                    link: link,
                },
            },
        },
    };

    const emailBody = mailGenerator.generate(bodyEmail);

    return emailBody;
};
