import { createContext, ReactNode, useEffect, useState, useContext } from 'react';
import { api } from '../services/api';


interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

// interface TransactionInput {
//     title: string;
//     amount: number;
//     type: string;
//     category: string;
// }

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionsContextData {
    transactions: Array<Transaction>;
    createTransaction: (transaction: TransactionInput ) => Promise<void>;
}

export const TransactionContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
    );


export function TransactionsProvider ({ children } : TransactionsProviderProps ) {

    const [ transactions, setTransactions ] = useState<Transaction[]>([]);
    
    useEffect(() => {
        api.get("/transactions")
            .then( ({ data }) => setTransactions( data.transactions ));
    }, [])

    async function createTransaction ( transactionInput: TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date(),
        } )
        
        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction,
        ])
    }

    return (
        <TransactionContext.Provider value={{transactions, createTransaction}}>
            { children }
        </TransactionContext.Provider>
    );
}

export function useTransactions (){
    const context = useContext(TransactionContext)

    return context;
}