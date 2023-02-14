import Mailgen from "mailgen";

type IEmailBody = {
    link: string;
    title: string;
    logo: string;
    text: string;
    name: string | null | undefined;
    color: string
    intro: string,
    formName: string
};

export const emailGenerator = ({
    link,
    title,
    logo,
    text,
    name,
    color,
    intro,
    formName
}: IEmailBody) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: formName as string,
            link: link,
            logo: logo,
        },
    });

    const bodyEmail = {
        body: {
            name: name as string,
            intro: intro,
            action: {
                instructions: text,
                button: {
                    color: color,
                    text: title,
                    link: link,
                },
            },
        },
    };

    const emailBody = mailGenerator.generate(bodyEmail);

    return emailBody;
};
