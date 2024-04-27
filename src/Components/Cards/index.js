import React from 'react'
import './styles.css'
import Button from '../Buttons';
import { Card, Col, Flex, Row } from "antd";

const Cards = ({income,expense,totalBalance,showExpenseModal, showIncomeModal,resetBalance}) => {
    return (
        <div>
            <Row style={{
                // display:"flex",
                // flexWrap:"wrap",
                // gap:"16px",
                // justifyContent:"space-between"
            }} className='my-row'>
                <Col >
                    <Card title="Current Balance" bordered={true} className='my-card'>
                        <p>₹{totalBalance}</p>
                        <Button text="Reset Balance" onClick={resetBalance} blue={true} />
                    </Card>
                </Col>
                <Col >
                    <Card title="Total Income" bordered={true} className='my-card'>
                        <p>₹{income}</p>
                        <Button text="Add Income" blue={true} onClick={showIncomeModal} />
                    </Card>
                </Col>
                <Col >
                    <Card title="Total Expense" bordered={true} className='my-card'>
                        <p>₹{expense}</p>
                        <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
                    </Card>
                </Col>

            </Row>
            
        </div>
    )
}

export default Cards