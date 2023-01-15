## EasyAPI

```js
const pay = new PayPal({
  clientId: "your_client_id",
  secret: "your_secret",
  mode: "sandbox",
  returnUrl: "https://your-return-url.com",
  cancelUrl: "https://your-cancel-url.com",
});

pay.createPayment(
  { amount: "10.00", currency: "USD", description: "Payment for item" },
  (error, payment) => {
    if (error) {
      console.error(error);
    } else {
      pay.getApprovalUrl(payment.id, (error, approvalUrl) => {
        if (error) {
          console.error(error);
        } else {
          console.log(approvalUrl);
        }
      });
    }
  }
);

pay.executePayment(paymentId, payerId, (error, payment) => {
  if (error) {
    console.error(error);
  } else {
    console.log(payment);
  }
});
```