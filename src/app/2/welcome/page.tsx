import { PaymentModel } from '@/lib/models/payment';
import WelcomeComponent from './WelcomeComponent';
import { CookieAuth } from '@/lib/utils/cookieAuth';
import connectDB from '@/lib/mongodb';
import { NftModel } from '@/lib/models/nft';
import { handCash } from '@/lib/handcash';
import { getAuthenticatedUserOrThrow } from '@/app/api/ApiInteractor';

export const revalidate = 0;

export default async function Page() {
    let user;
    try {
        user = await getAuthenticatedUserOrThrow();
    } catch (error) {
        return (
            <WelcomeComponent isBurnNftCompleted={false} isBuyNftCompleted={false} isCreateNftCompleted={false} />
        );
    }
    await connectDB();
    const account = await handCash.getAccountFromAuthToken(user.authToken);
    const results = await Promise.all([
        NftModel.find({ userId: user.handcashId, label: { $exists: false } }),
        account.items.getItemsInventory({ searchString: 'Diploma' }),
        PaymentModel.find({ userId: user.handcashId, tag: 'buyNft' }),
    ]);

    return (
        <WelcomeComponent isCreateNftCompleted={results[0].length > 0} isBurnNftCompleted={results[1].length > 0} isBuyNftCompleted={results[2].length > 0} />
    );
}
