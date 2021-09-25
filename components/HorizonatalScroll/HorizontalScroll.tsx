import React from "react";
import { HorizontalScrollLayout, ViewBox} from './HorizontalScroll.style'

const HorizontalScroll: React.FC = () => {
    return (
        <>

        <HorizontalScrollLayout style={{gridArea: 'b'}}>
            {[1, 2, 3,4,5,6,7,7,8].map((el: any, i: number) => (
                <ViewBox key={i}>
                    <span style={{color: 'black'}}>to</span>
                </ViewBox>
            ))}
            </HorizontalScrollLayout>
            </>
    )
}
export default HorizontalScroll;