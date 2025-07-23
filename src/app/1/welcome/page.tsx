import { PaymentModel } from '@/lib/models/payment';
import WelcomeComponent from './WelcomeComponent';
import { CookieAuth } from '@/lib/utils/cookieAuth';
import connectDB from '@/lib/mongodb';

export const revalidate = 0;

export default async function Page() {
    const userId = await CookieAuth.getHandCashIdFromCookie();
    if (!userId) {
        return (
            <WelcomeComponent isPaymentCompleted={false} isPaymentRequestCompleted={false} />
        );
    }
    await connectDB();
    const results = await Promise.all([
        PaymentModel.find({ userId, tag: 'tip' }),
        PaymentModel.find({ userId, tag: 'avatar' }),
    ]);

    return (
        <WelcomeComponent isPaymentCompleted={results[0].length > 0} isPaymentRequestCompleted={results[1].length > 0} />
    );
}
