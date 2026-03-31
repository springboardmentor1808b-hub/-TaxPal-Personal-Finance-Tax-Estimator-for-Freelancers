import React from "react";

export default function TransactionsTable({ transactions = [], onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Recent Transactions
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Date</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3">{tx.date}</td>
                  <td>{tx.description}</td>
                  <td>{tx.category}</td>
                  <td className="font-semibold">${tx.amount}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
