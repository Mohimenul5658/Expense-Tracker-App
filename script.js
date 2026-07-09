const expenseForm = document.getElementById("expenseForm");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const payment = document.getElementById("payment");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const resetBtn = document.getElementById("resetBtn");
const expenseTableBody = document.getElementById("expenseTableBody");
const totalExpense = document.getElementById("totalExpense");
const totalTransaction = document.getElementById("totalTransaction");
const highestExpense = document.getElementById("highestExpense");
const lowestExpense = document.getElementById("lowestExpense");
const averageExpense = document.getElementById("averageExpense");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

let expenses = [];
let editIndex = null;

expenseForm.addEventListener("submit", (e)=>{
    
    e.preventDefault();

    if (editIndex !== null) {
    return;
    }

    const expenseTitle = title.value.trim();
    const expenseAmount = Number(amount.value);
    const expenseCategory = category.value;
    const expenseDate = date.value;
    const expensePayment = payment.value;

    if (
    expenseTitle === "" ||
    expenseAmount === "" ||
    expenseCategory === "" ||
    expenseDate === "" ||
    expensePayment === ""
    ){
        alert("Please fill all fields!");
        return;
    }

    if (expenseAmount <= 0) {
        alert("Amount must be greater than 0!");
        return;
    }

    const expense= {
    title: expenseTitle,
    amount: expenseAmount,
    category: expenseCategory,
    date: expenseDate,
    payment: expensePayment
    };
    expenses.push(expense); 
    displayExpenses();
    updateSummary();
    saveToLocalStorage();
     expenseForm.reset();
});

updateBtn.addEventListener("click", () => {
    if (editIndex === null) return;

    expenses[editIndex] = {
        title: title.value.trim(),
        amount: Number(amount.value),
        category: category.value,
        date: date.value,
        payment: payment.value

    };
    displayExpenses();
    expenseForm.reset();
    updateSummary();
    saveToLocalStorage();
    addBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
    editIndex = null;
});

resetBtn.addEventListener("click", () => {
    editIndex = null;
    addBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
});

const displayExpenses = () => {
     if(expenses.length === 0){
    expenseTableBody.innerHTML = `    
    <tr>
        <td colspan="7" class="empty">
            No expenses added yet.
        </td>
    </tr>
    `;
    return;
    }
    expenseTableBody.innerHTML = "";
    expenses.forEach((expense, index) => {
        const row = `
        <tr>
            <td>${index + 1}</td>
            <td>${expense.title}</td>
            <td>${expense.amount} BDT</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>${expense.payment}</td>
            <td>
                <button class="edit-btn" onclick="editExpense(${index})"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="delete-btn" onclick="deleteExpense(${index})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
        </tr>
        `;
        expenseTableBody.innerHTML += row;
    });
};
const deleteExpense = (index) => {
const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;
    expenses.splice(index, 1);
    displayExpenses();
    updateSummary();
    saveToLocalStorage();
};
const editExpense = (index) => {
    editIndex = index;
    const expense = expenses[index];
    title.value = expense.title;
    amount.value = expense.amount;
    category.value = expense.category;
    date.value = expense.date;
    payment.value = expense.payment;
    addBtn.style.display = "none";
    updateBtn.style.display = "inline-block";
};

const updateSummary = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const transaction = expenses.length;

    const highest = transaction
        ? Math.max(...expenses.map(expense => expense.amount))
        : 0;

    const lowest = transaction
        ? Math.min(...expenses.map(expense => expense.amount))
        : 0;

    const average = transaction
        ? (total / transaction).toFixed(2)
        : 0;

    totalExpense.textContent = `${total} BDT`;
    totalTransaction.textContent = transaction;
    highestExpense.textContent = `${highest} BDT`;
    lowestExpense.textContent = `${lowest} BDT`;
    averageExpense.textContent = `${average} BDT`;

};

const saveToLocalStorage = () => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
};

const loadFromLocalStorage = () => {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    }
};

clearBtn.addEventListener("click", () => {
    if (expenses.length === 0) {
        alert("No expenses to clear!");
        return;
    }
    const confirmClear = confirm("Are you sure you want to delete all expenses?");

    if (!confirmClear) return;
    expenses = [];
    saveToLocalStorage();
    displayExpenses();
    updateSummary();
});

exportBtn.addEventListener("click", () => {
    if (expenses.length === 0) {
        alert("No expenses to export!");
        return;
    }
    const headers = [
        "Title",
        "Amount",
        "Category",
        "Date",
        "Payment"
    ];
    let csv = headers.join(",") + "\n";
    expenses.forEach(expense => {
        csv += [
            expense.title,
            expense.amount,
            expense.category,
            expense.date,
            expense.payment
        ].join(",") + "\n";
    });
    const blob = new Blob([csv], {
        type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
});

loadFromLocalStorage();

displayExpenses();
updateSummary();