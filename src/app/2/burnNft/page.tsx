import { getAuthenticatedUserOrThrow } from "@/app/api/ApiInteractor";
import { handCash } from "@/lib/handcash";
import { redirect } from "next/navigation";
import BurnNftComponent from "./BurnNftComponent";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
    let user;
    try {
        user = await getAuthenticatedUserOrThrow();
    } catch (error) {
        return redirect('/1/connect');
    }
    const account = handCash.getAccountFromAuthToken(user.authToken);
    const inventory1 = await account.items.getItemsInventory({
        groupingValue: 'd4f5e088af956a5426d004edefc5b28f',
    });
    const inventory2 = await account.items.getItemsInventory({
        searchString: 'Diploma'
    });
    return (
        <BurnNftComponent hasAnyBox={!!inventory1[0]} isBoxOpen={!!inventory2[0]} />
    );
}
