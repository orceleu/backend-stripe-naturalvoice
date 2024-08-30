const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { doc, setDoc } = require("firebase/firestore");
const { db } = require("./config.js");
const { buffer } = require("micro");

const stripe = require("stripe")(
  "rk_test_51OpACQHMq3uIqhfs00n0gcUmcgIkPvmMFdjGRObxHfSc5EkNGP7v6przRFwHH22WpQjKVp4OwQMquMJEuR9klutb00Yh2lqQGk"
);

const app = express();

//app.use(bodyParser.urlencoded({ extended: true }));

const corsOption = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_4776402dd66d977d463c3a5e20708000ee5bc49a7bb524d1d6765eeda1b7f520";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const req = buffer(request);
    const sig = request.headers["stripe-signature"];
    //console.log(request.body);
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.log(`error: ${err}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    console.log(`event :${event.type}`);
    switch (event.type) {
      case "checkout.session.completed":
        const subscription = event.data.object;
        const subscriptionId = subscription.subscription;
        const customerId = subscription.customer;
        const userId = subscription.metadata.userId;
        console.log(userId);
        // Then define and call a function to handle the event checkout.session.completed
        addCustomerSub_Id(subscriptionId, customerId, userId);
        break;
      // ... handle other event types

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.listen(4242, () => console.log("Running on port 4242"));
const addCustomerSub_Id = async (
  stripe_subscription_id,
  stripe_customer_id,
  userId
) => {
  try {
    await setDoc(doc(db, "usersPlan", userId), {
      having_plan: true,
      subscription_id: stripe_subscription_id,
      customer_id: stripe_customer_id,
      plan: "starter",
      used_char: 40000,
    });

    console.log("inserted to userPlan! .");
  } catch (e) {
    console.error("Error:", e);
  }
};
app.use(express.json());
