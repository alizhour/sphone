export const calculateKarat = (oncePrice: number) => {
    const twentyFour = parseFloat(((oncePrice * 32) / 1000).toFixed(2));
    const twentyTwo = parseFloat(((((oncePrice * 32) / 1000) * 916) / 995).toFixed(2));
    const twentyOne = parseFloat(((((oncePrice * 32) / 1000) * 875) / 995).toFixed(2));
    const eightTeen = parseFloat(((((oncePrice * 32) / 1000) * 750) / 995).toFixed(2));

    return { twentyFour, twentyTwo, twentyOne, eightTeen };
}

export const calculateKaratForItems = (oncePrice: number, commission: number) => {
    const twentyFour = parseFloat((((oncePrice + commission) * 32) / 1000).toFixed(2));
    const twentyTwo = parseFloat((((((oncePrice + commission) * 32) / 1000) * 916) / 995).toFixed(2));
    const twentyOne = parseFloat((((((oncePrice + commission) * 32) / 1000) * 875) / 995).toFixed(2));
    const eightTeen = parseFloat((((((oncePrice + commission) * 32) / 1000) * 750) / 995).toFixed(2));

    return { twentyFour, twentyTwo, twentyOne, eightTeen };
}




//! USED WHEN CALCULATE ITEM PRICE
// if (e?.karat === 24) {
//     newObj.price = ((res?.twentyFour * e?.weight) / kwd).toFixed(3);
// }
// if (e?.karat === 22) {
//     newObj.price = ((res?.twentyTwo * e?.weight) / kwd).toFixed(3);
// }
// if (e?.karat === 21) {
//     newObj.price = ((res?.twentyOne * e?.weight) / kwd).toFixed(3);
// }
// if (e?.karat === 18) {
//     newObj.price = ((res?.eightTeen * e?.weight) / kwd).toFixed(3);
// }