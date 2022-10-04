import {ConnectButton} from 'web3uikit'
import Link from 'next/link'

const Header = () => {
    return(
        <nav className='p-5 border-b-2 flex flex-row justify-between items-center'>
            <h1 className='py-4 px-4 font-bold text-3xl'>NFT Marketplace</h1>
            <div className='flex flex-row items-center'>
                <Link href="/">
                    <a className='mr-4 p-5'>Homepage</a>
                </Link>

                <Link href="/sell-nft">
                    <a className='mr-4 p-5'>Sell NFT</a>
                </Link>

                <ConnectButton moralisAuth={false}/>
            </div>
        </nav>
        
    )

}

export default Header;