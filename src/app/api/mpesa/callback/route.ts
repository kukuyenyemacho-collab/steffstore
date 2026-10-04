import { NextResponse } from 'next/server';
import { recordOrder } from '@/lib/orders';

// Safaricom posts the STK Push result here. Always acknowledge, then forward the result
// to the order webhook so the team (or your database) can mark the order paid.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    Body?: { stkCallback?: { CheckoutRequestID?: string; ResultCode?: number; ResultDesc?: string; CallbackMetadata?: { Item?: { Name: string; Value?: string | number }[] } } };
  } | null;
  const cb = body?.Body?.stkCallback;
  if (cb) {
    const meta = Object.fromEntries((cb.CallbackMetadata?.Item ?? []).map((i) => [i.Name, i.Value]));
    await recordOrder(
      {
        checkoutRequestId: cb.CheckoutRequestID,
        paid: cb.ResultCode === 0,
        resultDesc: cb.ResultDesc,
        amount: meta.Amount,
        receipt: meta.MpesaReceiptNumber,
        phone: meta.PhoneNumber,
        at: meta.TransactionDate,
      },
      'mpesa-callback',
    );
  }
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
