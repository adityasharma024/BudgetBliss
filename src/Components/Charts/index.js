import React from 'react';
import { Line, Pie } from '@ant-design/charts';

const ChartComponent = ({ sortedTransactions }) => {
    // Check if sortedTransactions is null or undefined, if yes, return null or handle the case accordingly
    if (!sortedTransactions) {
        return null; // Or return an error message or loading indicator
    }

    const data = sortedTransactions.map((item) => ({
        date: item.date,
        amount: item.amount
    }));

    
    const spendingData = sortedTransactions
        .filter((transaction) => transaction.type === "expense")
        .map((transaction) => ({
            tag: transaction.tag,
            amount: transaction.amount
        }));


    const newSpendings=[{tag:"food",amount:0},{tag:"education",amount:0},{tag:"others",amount:0}];
    spendingData.forEach((item)=>{
        if(item.tag=="food"){
            newSpendings[0].amount+=item.amount;
        }
        else if(item.tag=="education"){
            newSpendings[1].amount+=item.amount;

        }
        else{
            newSpendings[2].amount+=item.amount;
        }
    });
    const lineConfig = {
        data,
        width: 700,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
    };

    const pieConfig = {
        data: newSpendings,
        width: 500,
        angleField: "amount",
        colorField: "tag",
    };

    return (
        <div className='charts-wrapper'>
            <div className=''>
                <h2 style={{ marginTop: "0" }}>Your Analytics</h2>
                <Line {...lineConfig} />
            </div>
            <div className=''>
                <h2 style={{ marginTop: "0" }}>Your Spending</h2>
                <Pie {...pieConfig} />
            </div>
        </div>
    );
}

export default ChartComponent;
