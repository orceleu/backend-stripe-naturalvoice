const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cors = require("cors");
const express = require("express");
const { doc, setDoc, updateDoc } = require("firebase/firestore");
const { db } = require("./config.js");

const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));
//console.log(process.env.STRIPE_API_KEY);
const corsOption = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.WEBHOOK_SECRET;
//console.log(endpointSecret);
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
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
      case "checkout.session.completed": {
        const subscription = event.data.object;
        const subscriptionId = subscription.subscription;
        const customerId = subscription.customer;
        const userId = subscription.metadata.userId;
        console.log(userId);
        // Then define and call a function to handle the event checkout.session.completed
        addCustomerSub_Id(subscriptionId, customerId, userId);
        break;
      }

      // ... handle other event types

      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object;
        const customerId = subscriptionDeleted.customer;
        const userId = subscriptionDeleted.metadata.userId;
        console.log(userId);
        setCancelSubscription(false, userId);
        break;
      case "customer.subscription.paused":
        const subscriptionPaused = event.data.object;
        const customerIdP = subscriptionPaused.customer;
        const userIdP = subscriptionPaused.metadata.userId;
        console.log(userId);
        setCancelSubscription(false, userIdP);
        break;
      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object;
        break;
      case "customer.subscription.resumed":
        const subscriptionResumed = event.data.object;
        break;

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

const setCancelSubscription = async (having_plan, userId) => {
  try {
    await updateDoc(doc(db, "usersPlan", userId), {
      having_plan: having_plan,
      plan: "",
    });
    console.log("inserted to userPlan/cancel subscription! .");
  } catch (e) {
    console.error("Error:", e);
  }
};
app.use(express.json());
