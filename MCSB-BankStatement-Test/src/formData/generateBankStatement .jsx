import React, { useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";

const generateBankStatement = (totalAmount, numberOfTransactions) => {
  const transactions = [];
  let balance = 0;

  // Generate random transactions until the total amount is reached
  while (totalAmount > 0 && numberOfTransactions > 0) {
    // Randomly select transaction type (withdrawal, deposit, expense)
    const transactionType = Math.random();
    let amount = 0;
    let description = "";

    if (transactionType < 0.3) {
      // Withdrawal
      amount = -Math.floor(Math.random() * (totalAmount - 5000) + 5000); // Negative amount with minimum of 5000
      description = "Withdrawal";
    } else if (transactionType < 0.6) {
      // Deposit
      amount = Math.floor(Math.random() * (totalAmount - 5000) + 5000); // Positive amount with minimum of 5000
      description = "Deposit";
    } else {
      // Expense
      amount = -Math.floor(Math.random() * (totalAmount - 5000) + 5000); // Negative amount with minimum of 5000
      description = "Expense";
    }

    // Create transaction object and add it to the transactions array
    transactions.push({ amount, description });

    // Update the balance
    balance += amount;

    // Decrement the total amount by the absolute value of the transaction amount
    totalAmount -= Math.abs(amount);

    // Decrement the number of remaining transactions
    numberOfTransactions--;
  }

  return transactions;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0", // Add a light background color for the page
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 24, // Increase font size for header
    fontWeight: "bold",
    color: "#333", // Darken header text color
    textTransform: "uppercase", // Convert header text to uppercase
    backgroundColor: "yellow", // Set header background color to yellow
    padding: 10, // Add padding to header
  },
  table: {
    width: "100%",
    border: "1px solid #ccc", // Change border color to a lighter shade
    borderCollapse: "collapse",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for the table
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: 12, // Increase padding for table header
    textAlign: "center",
    fontWeight: "bold",
    color: "#666", // Darken text color for table header
  },
  tableRow: {
    border: "1px solid #ccc",
    padding: 8, // Increase padding for table rows
    textAlign: "center",
    backgroundColor: "#f9f9f9", // Light-colored background for table rows
  },
});

const BankStatement = () => {
  const [totalAmount, setTotalAmount] = useState(1000);
  const [numberOfTransactions, setNumberOfTransactions] = useState(10);
  const [bankStatement, setBankStatement] = useState([]);

  const handleTotalAmountChange = (event) => {
    setTotalAmount(event.target.value);
  };

  const handleNumberOfTransactionsChange = (event) => {
    setNumberOfTransactions(event.target.value);
  };

  const generateTransactions = () => {
    const transactions = generateBankStatement(
      parseInt(totalAmount),
      parseInt(numberOfTransactions)
    );
    setBankStatement(transactions);
  };

  return (
    <div>
      <h2>Bank Statement</h2>
      <div>
        <label>Total Amount:</label>
        <input
          type="number"
          value={totalAmount}
          onChange={handleTotalAmountChange}
        />
      </div>
      <div>
        <label>Number of Transactions:</label>
        <input
          type="number"
          value={numberOfTransactions}
          onChange={handleNumberOfTransactionsChange}
        />
      </div>
      <button onClick={generateTransactions}>Generate Transactions</button>
      {/* Place the PDFDownloadLink component here */}
      <PDFDownloadLink
        document={<PdfDocument bankStatement={bankStatement} />}
        fileName="bank_statement.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download PDF"
        }
      </PDFDownloadLink>
      <div id="pdf-content">
        {/* This div will be used to capture the content for PDF generation */}
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bankStatement.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Define a separate component for the PDF document
const PdfDocument = ({ bankStatement }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Bank Statement</Text>
      <table style={styles.table}>
        <thead>
          <tr>
            <Text style={styles.tableHeader}>Description</Text>
            <Text style={styles.tableHeader}>Amount</Text>
          </tr>
        </thead>
        <tbody>
          {bankStatement.map((transaction, index) => (
            <tr key={index}>
              <Text style={styles.tableRow}>{transaction.description}</Text>
              <Text style={styles.tableRow}>{transaction.amount}</Text>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  </Document>
);

export default BankStatement;
