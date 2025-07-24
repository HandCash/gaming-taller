import { PaymentModel } from '@/lib/models/payment';
import WelcomeComponent from './WelcomeComponent';
import { CookieAuth } from '@/lib/utils/cookieAuth';
import connectDB from '@/lib/mongodb';
import { NftModel } from '@/lib/models/nft';

export const revalidate = 0;

export default async function Page() {
    const userId = await CookieAuth.getHandCashIdFromCookie();
    if (!userId) {
        return (
            <WelcomeComponent isBurnNftCompleted={false} isBuyNftCompleted={false} isCreateNftCompleted={false} />
        );
    }
    await connectDB();
    const results = await Promise.all([
        NftModel.find({ userId, label: { $exists: false } }),
        NftModel.find({ userId, label: 'diploma' }),
        PaymentModel.find({ userId, tag: 'buyNft' }),
    ]);

    return (
        <WelcomeComponent isCreateNftCompleted={results[0].length > 0} isBurnNftCompleted={results[1].length > 0} isBuyNftCompleted={results[2].length > 0} />
    );
}
