import Stripe from "stripe";

export const stripe = new Stripe(process.env.KAY_STRIPE_SECRETA as string, {
    apiVersion: "2022-11-15",
});
