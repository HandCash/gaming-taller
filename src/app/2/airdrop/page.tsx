import AirdropNftComponent from "./AirdropNftComponent";

export const revalidate = 0;

export default function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
    if (searchParams['transactionId']) {
        return (
            <div className="flex flex-col items-center justify-center p-16">
                <h3 className="text-2xl font-bold mb-2 text-green-500">Gracias por el pago!</h3>
                <p className="mb-8">Este es tu avatar</p>
                <img src="/next.svg" width={100} height={100} className="w-56 h-56 rounded-full border shadow-lg" />
            </div>
        );
    }
    return (
        <AirdropNftComponent />
    );
}
