export const getBidStartPrice = (price)=>{
    switch(price){
        case(price < 6):
            return 1.00
        case(price >=6 && price <=10):
            return 2.00
        case(price>10 && price <=20):
            return 3.00
        case(price >20 && price <=50):
            return 5.00
        case(price >50 && price <=100):
            return 10.00
    }
    const v = Math.round((price/100)*20)
    return (v)
}
