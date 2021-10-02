import { assert } from "chai";
import React, { useEffect } from "react";
import { HorizontalScrollLayout, ViewBox } from './HorizontalScroll.style'

export enum HorizontalScrollType {
    MARKETPLACE = 'marketplace',
    FRONTENDS = 'frontends'
}

type NFT = {
    name: string;
    image: any;
    description: string;
    price: string;
}

interface IHorizontalScroll {
    type: HorizontalScrollType;
    frontends?: any[];
    nfts?: NFT[];
    buyNFT?: (nft: any) => void
}

const HorizontalScroll: React.FC<IHorizontalScroll> = ({ type, nfts, frontends, buyNFT }) => {
    if(nfts === undefined && frontends === undefined) return <div>Loading</div>
    console.log(frontends, 'frone')
    return (
        <>
{nfts !== undefined ?
        <HorizontalScrollLayout style={{gridArea: 'b'}}>

                    {nfts.map((el: NFT, i: number) => (
                        <ViewBox key={i}>
                            <div style={{
                                display: 'grid', grid: `
                                        'a b'
                                        'c b'
                                        'd b'
                            `}}><img src={el.image} height={100} style={{color: 'black', gridArea: 'b'}}/>
                            <h3 style={{color: 'black', gridArea: 'a'}}>Name: {el.name}</h3>
                            <div style={{color: 'black', gridArea: 'c'}}>Price: {el.price}</div>
                                <p style={{ color: 'black', gridArea: 'd' }}>Description: {el.description}</p>
                                <button onClick={() => buyNFT(el)}>Buy</button>
                            </div>
                        </ViewBox>
                    ))}



                </HorizontalScrollLayout> :

            <HorizontalScrollLayout style={{gridArea: 'b'}}>

            {frontends?.length > 0  ? frontends.map((frontend: any, i: number) => (
                <ViewBox key={i}>
                    <div>{frontend}</div>
                </ViewBox>
            )) :
            <ViewBox>
            <h1 style={{color: 'black'}}>NO UIs here :/</h1>
        </ViewBox>
            }



        </HorizontalScrollLayout>


            }
            </>
    )
}
export default HorizontalScroll;