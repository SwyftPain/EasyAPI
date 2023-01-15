import * as paypal from "paypal-rest-sdk";

/**
 * PayPal class
 * @class PayPal class for PayPal REST API
 * @param {Object} options - Options for PayPal class
 * @param {string} options.clientId - PayPal client id
 * @param {string} options.secret - PayPal secret
 * @param {string} options.mode - PayPal mode (sandbox or live)
 * @param {string} options.returnUrl - PayPal return url
 * @param {string} options.cancelUrl - PayPal cancel url
 * @returns {PayPal} PayPal class
 * @example
 * ```ts
 * const pay = new PayPal({
 * clientId: 'your_client_id',
 * secret: 'your_secret',
 * mode: 'sandbox',
 * returnUrl: 'https://your-return-url.com',
 * cancelUrl: 'https://your-cancel-url.com'
 * });
 *
 * pay.createPayment({ amount: '10.00', currency: 'USD', description: 'Payment for item' }, (error, payment) => {
 * if (error) {
 * console.error(error);
 * } else {
 * pay.getApprovalUrl(payment.id, (error, approvalUrl) => {
 * if (error) {
 * console.error(error);
 * } else {
 * console.log(approvalUrl);
 * }
 * });
 * }
 * });
 *
 * pay.executePayment(paymentId, payerId, (error, payment) => {
 * if (error) {
 * console.error(error);
 * } else {
 * console.log(payment);
 * }
 * });
 * ```
 */
class PayPal {
  private clientId: string;
  private secret: string;
  private mode: string;
  private returnUrl: string;
  private cancelUrl: string;
  payment: any;

  constructor(options: {
    clientId: string;
    secret: string;
    mode?: string;
    returnUrl?: string;
    cancelUrl?: string;
  }) {
    this.clientId = options.clientId;
    this.secret = options.secret;
    this.mode = options.mode || "sandbox";
    this.returnUrl = options.returnUrl || "https://return.url";
    this.cancelUrl = options.cancelUrl || "https://cancel.url";
    paypal.configure({
      mode: this.mode,
      client_id: this.clientId,
      client_secret: this.secret,
    });
  }

  /**
   *
   * @param arg0 {} { mode: string; client_id: string; client_secret: string; }
   * @returns {void} void
   * @example
   * ```ts
   * pay.configure({ mode: 'sandbox', client_id: 'your_client_id', client_secret: 'your secret' });
   * ```
   */
  configure(arg0: { mode: string; client_id: string; client_secret: string }) {
    throw new Error("Method not implemented.");
  }

  /**
   *
   * @param options {} { amount: string; currency?: string; description?: string; items?: any[]; }
   * @param callback {any} any
   * @returns {void} void
   * @example
   * ```ts
   * pay.createPayment({ amount: '10.00', currency: 'USD', description: 'Payment for item' }, (error, payment) => {
   * if (error) {
   * console.error(error);
   * } else {
   * pay.getApprovalUrl(payment.id, (error, approvalUrl) => {
   * if (error) {
   * console.error(error);
   * } else {
   * console.log(approvalUrl);
   * }
   * });
   * }
   * });
   * ```
   */
  createPayment(
    options: {
      amount: string;
      currency?: string;
      description?: string;
      items?: any[];
    },
    callback: any
  ) {
    if (!options.amount) {
      return callback(new Error("amount is required"));
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: this.returnUrl,
        cancel_url: this.cancelUrl,
      },
      transactions: [
        {
          item_list: {
            items: options.items || [
              {
                name: "item",
                sku: "item",
                price: options.amount,
                currency: options.currency || "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: options.currency || "USD",
            total: options.amount,
          },
          description:
            options.description || "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error: any, payment: any) => {
      if (error) {
        return callback(error);
      }
      return callback(null, payment);
    });
  }

  /**
   *
   * @param paymentId {string} string
   * @param payerId {string} string
   * @param callback {any} any
   * @returns {void} void
   * @example
   * ```ts
   * pay.executePayment(paymentId, payerId, (error, payment) => {
   * if (error) {
   * console.error(error);
   * } else {
   * console.log(payment);
   * }
   * });
   * ```
   */
  executePayment(paymentId: string, payerId: string, callback: any) {
    if (!paymentId) {
      return callback(new Error("paymentId is required"));
    }
    if (!payerId) {
      return callback(new Error("payerId is required"));
    }

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      (error: any, payment: any) => {
        if (error) {
          return callback(error);
        }
        return callback(null, payment);
      }
    );
  }

  /**
   *
   * @param paymentId {string} string
   * @param callback {any} any
   * @returns {void} void
   * @example
   * ```ts
   * pay.getApprovalUrl(paymentId, (error, approvalUrl) => {
   * if (error) {
   * console.error(error);
   * } else {
   * console.log(approvalUrl);
   * }
   * });
   * ```
   */
  getApprovalUrl(paymentId: string, callback: any) {
    if (!paymentId) {
      return callback(new Error("paymentId is required"));
    }

    paypal.payment.get(paymentId, (error: any, payment: any) => {
      if (error) {
        return callback(error);
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          return callback(null, payment.links[i].href);
        }
        return callback(new Error("approval_url not found"));
      }
    });
  }
}

const pay = new PayPal({
  clientId: "your_client_id",
  secret: "your_secret",
  mode: "sandbox",
  returnUrl: "https://your-return-url.com",
  cancelUrl: "https://your-cancel-url.com",
});

pay.createPayment(
  { amount: "10.00", currency: "USD", description: "Payment for item" },
  (error: any, payment: any) => {
    if (error) {
      console.error(error);
    } else {
      pay.getApprovalUrl(payment.id, (error: any, approvalUrl: string) => {
        if (error) {
          console.error(error);
        } else {
          console.log(approvalUrl);
        }
      });
    }
  }
);

export default PayPal;