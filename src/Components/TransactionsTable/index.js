import React, { useState } from 'react';
import { Input, Select, Table, Radio } from 'antd';
import searchImg from "../../assets/search.svg";
import './styles.css'
import Papa, { parse } from 'papaparse'
import { toast } from 'react-toastify';
const { Option } = Select;



const TransactionsTable = ({ transactions,addTransaction,fetchTransactions }) => {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("")
    const [typeofFilter, setTypeFilter] = useState("");

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        }
    ];

    let filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeofFilter === "" || item.type.includes(typeofFilter))
    );
    let sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortKey == 'date') {
            return new Date(a.date) - new Date(b.date);

        }
        else if (sortKey === 'amount') {
            return a.amount - b.amount;
        }
        else {
            return 0;
        }
    })
    const dataSource = sortedTransactions.map((transactions, index) => ({
        key: index,
        ...transactions,
    }));
    function exportToCsv() {
        var csv = Papa.unparse({
            fields: ["name", "type", "date", "amount","tag"],
            data: dataSource.map(transaction => ({
                name: transaction.name,
                type: transaction.type,
                date: transaction.date,
                amount: transaction.amount,
                tag:transaction.tag,
            }))
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function importFromCsv(event) {
        event.preventDefault();
        try {
          parse(event.target.files[0], {
            header: true,
            complete: async function (results) {
                for(const transaction of results.data){
                    const newTransaction={
                        ...transaction,
                        amount:parseFloat(transaction.amount),

                    };
                    await addTransaction(newTransaction,true);

                }
             
            },
          });
          toast.success("All Transactions Added");
          fetchTransactions();

          
         
          event.target.files = null;
        } catch (e) {
          toast.error(e.message);
        }
      }
    

    return (
        <div
            style={{
                width: "97%",
                padding: "0rem 2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div className="input-flex">
                    <img src={searchImg} width="16" />
                    <input
                        placeholder="Search by Name"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeofFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>
            </div>

            {/* <Select
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => setSelectedTag(value)}
          placeholder="Filter by tag"
          allowClear
        >
          <Option value="food">Food</Option>
          <Option value="education">Education</Option>
          <Option value="office">Office</Option>
        </Select> */}
            <div className="my-table">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "1rem",
                    }}
                >
                    <h2>My Transactions</h2>

                    <Radio.Group
                        className="input-radio"
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value="">No Sort</Radio.Button>
                        <Radio.Button value="date">Sort by Date</Radio.Button>
                        <Radio.Button value="amount">Sort by Amount</Radio.Button>
                    </Radio.Group>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem",
                            width: "400px",
                        }}
                    >
                        <button className="btn"
                            onClick={exportToCsv}
                        >
                            Export to CSV
                        </button>
                        <label for="file-csv" className="btn btn-blue">
                            Import from CSV
                        </label>
                        <input
                            onChange={importFromCsv}
                            id="file-csv"
                            type="file"
                            accept=".csv"
                            required
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                <Table columns={columns} dataSource={dataSource} />
            </div>
        </div>
    );

}

export default TransactionsTable;
