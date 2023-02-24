const express = require('express')
const chargebee = require("chargebee")
// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require('cors')

chargebee.configure({
  site: "s1fl-test",
  api_key: "test_AesmcdSiCa9G0W1TlGcu3aBZyXDBcupq5eT"
});
const app = express()

app.use(express.urlencoded())
app.use(cors())

app.post("/api/generate_checkout_existing_url", (req, res) => {
  chargebee.hosted_page.checkout_existing({
    subscription: {
      id: "AzZTTyTWiVpq65ZB"
    },
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      res.send(result.hosted_page);
    }
  });
});


app.post("/api/generate_update_payment_method_url", (req, res) => {
  chargebee.hosted_page.manage_payment_sources({
    card: {
      gateway_account_id: "gw_6okrmTWW8xHU6Fm"
    },
    customer: {
      id: "AzZiyhTWmsqa43SlY"
    }
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      console.log(result);
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/generate_checkout_new_url", (req, res) => {
  chargebee.hosted_page.checkout_new_for_items({
    subscription_items: [
      {
        item_price_id: "hvac-pricing",
        unit_price: 100,
        quantity: 1,
        remaining_billing_cycles: 12,
      }
    ]
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      console.log(result);
      res.send(result.hosted_page);
    }
  });
});


app.post("/api/generate_portal_session", (req, res) => {
  chargebee.portal_session.create({
    customer: {
      id: "AzZiyhTWmsqa43SlY"
    },
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      res.send(result.portal_session);
    }
  });
});

app.post('/api/generate_payment_intent', (req, res) => {
  chargebee.payment_intent.create(req.body)
    .request(function (error, result) {
      if (error) {
        res.status(error.http_status_code || 500);
        res.json(error);
      } else {
        res.json(result);
      }
    });
});

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/api/create_item_family', (req, res) => {
  chargebee.item_family.create(req.body).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      console.log(result);
      res.send(result.item_family);
    }
  });
});


app.post('/api/create_item', (req, res) => {
  chargebee.item.create(req.body).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      console.log(result);
      res.send(result.item);
    }
  });
});


app.post('/api/create_item_price', (req, res) => {
  chargebee.item_price.create(req.body).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      console.log(result);
      res.send(result.item_price);
    }
  });
});

app.post('/api/create_bank_account', (req, res) => {
  chargebee.payment_source.create_bank_account({
    customer_id: "AzZiyhTWmsqa43SlY",
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      console.log(result);
      var customer = result.customer;
      var payment_source = result.payment_source;
    }
  });
});

app.listen(8000, () => console.log('Example app listening on port 8000!'))
