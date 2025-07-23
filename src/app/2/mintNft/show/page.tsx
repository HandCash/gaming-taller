import AirdropNftComponent from "./ShowMintNftComponent";

export const revalidate = 0;

export default function MintNftComponent({ searchParams }: { searchParams: { [key: string]: string } }) {
    return (
        <AirdropNftComponent />
    );
}
