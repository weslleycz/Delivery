import * as Next from "next";
import { stripe } from "../../../services/stripe";
import { buffer } from "micro";
import { prismaClient } from "../../../services/prismaClient";

type StripeSession={
    payment_link:string;
}

const webhookSecret =<string> process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  const handler = async (req:Next.NextApiRequest, res:Next.NextApiResponse) => {
    if (req.method === "POST") {
        const buf = await buffer(req);
        const sig =<string | Buffer | string[]> req.headers["stripe-signature"];
    
        let event;
    
        try {
          event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err) {
          res.status(400).send(err);
          return;
        }
    
        if (event.type === "checkout.session.completed") {
            const intent = event.data.object as StripeSession;
           await prismaClient.order.update({
            where:{
                paymentLinkId:intent.payment_link
            },
            data:{
                pay:true,
                status:"Aguardando o envio"
            }
           })

          } else {
            //console.warn(event.type);
          }

        res.json({ received: true });
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  };
  
  export default handler;