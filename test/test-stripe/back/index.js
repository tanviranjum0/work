// "sk_test_51QTf0LIIekyP3QI3d8dEtUyKgIkqqtJASNGOhd7JiRHfPhgVTmBc2sMNmbTNxB2458wUM2VQ595SxZ0AN1pkj5RE00zC6DgbHe"
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
const stripe = require("stripe")(
  "sk_test_51QTf0LIIekyP3QI3d8dEtUyKgIkqqtJASNGOhd7JiRHfPhgVTmBc2sMNmbTNxB2458wUM2VQ595SxZ0AN1pkj5RE00zC6DgbHe"
);
const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Course" }],
  [2, { priceInCents: 5000, name: "Learn NextJS Course" }],
]);
app.get("/", (req, res) => {
  res.send("Hello");
});
app.post("/checkout", async (req, res) => {
  console.log("Processing checkout");
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "us_bank_account"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const storeitem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeitem?.name,
              images: [
                "https://www.americanexpress.com/content/dam/amex/en-bd/network/images/Amex-card-bd/amex-platinum-2023.jpg",
              ],
            },
            unit_amount: storeitem?.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",

      // line_items: req.body.items.map((item) => ({
      //   price_data: {
      //     currency: "usd",
      //     product_data: {
      //       name: storeItems.get(item.id)?.name,
      //       images: ["https://example.com/image.jpg"],
      //     },
      //     unit_amount: storeItems.get(item.id)?.priceInCents,
      //   },
      //   quantity: item.quantity,
      // })),
    });
    res.json(session);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
    return;
  }
});
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
