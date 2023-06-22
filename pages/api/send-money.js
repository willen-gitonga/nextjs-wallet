import microCors from 'micro-cors';
import IntaSend from 'intasend-node';

const cors = microCors();

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { account, amount } = req.body;

    const intasend = new IntaSend(
      '',
      '',
      true
    );

    try {
      const payouts = intasend.payouts();
      const resp = await payouts.mpesa({
        currency: 'KES',
        transactions: [
          {
            name: 'Willen Gitonga',
            account: account,
            amount: amount,
            narrative: 'Withdrawal Payment',
          },
        ],
      });

      console.log(`Payouts response: ${resp}`);

      // Approve payouts method can be called here if you would
      // like to auto-approve immediately
      payouts
        .approve(resp, false)
        .then((approveResp) => {
          console.log(`Payouts approve: ${approveResp}`);
        })
        .catch((err) => {
          console.error(`Payouts approve error: ${err}`);
        });

      res.status(200).json({ message: 'Money sent successfully!' });
    } catch (err) {
      console.error(`Payouts error: ${err}`);
      res
        .status(500)
        .json({
          message: 'An error occurred while sending money. Please try again later.',
        });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default cors(handler);
