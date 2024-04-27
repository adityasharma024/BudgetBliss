import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Cards from '../Cards';
import AddExpenseModal from '../Modals/addExpense';
import AddIncomeModal from '../Modals/addIncome'; 
import { addDoc,collection,deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth,db } from '../../Firebase';
import moment from "moment";
import NoTransactions from '../NoTransactions';

import {  query, where, getDocs } from "firebase/firestore";
import TransactionsTable from '../TransactionsTable';
import Page from '../Charts';
import ChartComponent from '../Charts';

const Dashboard = () => {
  // const transaction=[
  //   {
  //     type:"income",
  //     amount:1200,
  //     tag:"salary",
  //     name:"income1",
  //     date:"2023-05-24"

  //   },
  //   {
  //     type:"expense",
  //     amount:800,
  //     tag:"food",
  //     name:"expense 1",
  //     date:"2023-05-24",
  //   },
  // ]
  const [loading,setLoading]=useState(false);
  const [transactions,setTransactions]=useState([])
  const [user]=useAuthState(auth)
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income,setIncome]=useState(0);
  const [expense,setExpense]=useState(0);
  const [totalBalance,setTotalBalance]=useState(0);


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }
  const resetBalance = async () => {
    // Delete all documents in the 'transactions' collection for the current user
    try {
      const q = query(collection(db, `user/${user.uid}/transaction`));
      const querySnapshot = await getDocs(q);

      // Delete each document
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Reset balance states
      setTransactions([]);
      setIncome(0);
      setExpense(0);
      setTotalBalance(0);

      toast.success("Balance reset successfully");
    } catch (error) {
      console.error("Error resetting balance:", error);
      toast.error("Failed to reset balance");
    }
  };

  const onFinish = (values, type) => {
    // Handle finish logic here, e.g., submitting form data
    const newTransaction={
      type:type,
      date:values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
    };
    addTransaction(newTransaction);
    

  }
  async function addTransaction(transaction,many){
    try{
      const docRef=await addDoc(
        collection(db,`user/${user.uid}/transaction`),
        transaction
      );
      console.log("Document written with ID",docRef.id);
      if(!many)toast.success("Transaction added");
      const newArr=transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    }
    catch(e){
      console.error("Error Adding document:",e);
      
        if(!many) toast.error("Couldn't be added");
      


    }

  }
  useEffect(()=>{
    fetchTransactions();

  },[user]);
  useEffect(()=>{
    calculateBalance();

  },[transactions]);
  function calculateBalance(){
    let incomeTotal=0;
    let expenseTotal=0;
    transactions.forEach((transaction)=>{
      if(transaction.type==="income"){
        incomeTotal+=transaction.amount;
      }
      else{
        expenseTotal+=transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal-expenseTotal);

  }
  async function fetchTransactions(){
    setLoading(true);
    if(user){
      const q = query(collection(db, `user/${user.uid}/transaction`));

      const querySnapshot=await getDocs(q);
      let transactionsArray=[];
      querySnapshot.forEach((doc)=>{
        transactionsArray.push(doc.data());

      });
      setTransactions(transactionsArray);
     
            
      toast.success("Transactions Fetched");
      
      
    }
    setLoading(false);
   
  }
  let sortedTransactions=transactions.sort((a,b)=>{
    return new Date(a.date)- new Date(b.date);
  });
  


  return (
    <div className='dashboard-container'>
      <Header />
      {loading?<p>Loading...</p>:
      <>
      
      <Cards
        income={income}
        expense={expense}
        totalBalance={totalBalance}
        resetBalance={resetBalance}

        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />
      {transactions && transactions.length!=-0?<ChartComponent sortedTransactions={sortedTransactions}/>:<NoTransactions/>}
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      
      <TransactionsTable transactions={transactions} addTransaction={addTransaction}/>
      </>
}
    </div>
  );
}

export default Dashboard;
