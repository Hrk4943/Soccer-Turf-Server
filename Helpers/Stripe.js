import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const domain = process.env.Client_Side_URL;
export const paymentStripe = async (price, courtName, email, id) => {
  console.log(price, courtName, email, id);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "INR",
          product_data: { name: courtName + "- Turf Slot Booking" },
          unit_amount: price * 100,
          
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${domain}/success/${id}`,
    cancel_url: `${domain}/failed/${id}`,
    customer_email: email,
  });

  return session.id;
};
