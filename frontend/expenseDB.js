async function postExpenses(e) {
  e.preventDefault();
  const description = e.target.description.value;
  const category = e.target.category.value;
  const amount = e.target.amount.value;

  const obj = {
    description,
    category,
    amount,
  };
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/add/expenses",
      obj,
      { headers: { Authorization: token } }
    );

    window.location.href="./expenseDB.html"

  } catch (err) {
    console.log(err);
  }
}

function showPremiumUser() {
  const parentNode = document.getElementById("overalldata");
  const childNode = document.getElementById("razpay");
  parentNode.removeChild(childNode);
  parentNode.innerHTML =
    parentNode.innerHTML +
    "<h3>YOU ARE A PREMIUM USER NOW</h3>" +
    "<button onclick='showLeaderBoard()'>Show Leaderboard</button>" +
    "<button onclick='downloadExpenses()' style='margin-left: 10px'>Download Expenses</button>";
}

async function downloadExpenses() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:5000/download/expenses",
      {
        headers: { Authorization: token },
      }
    );
    if (response.status === 200) {
      var a = document.createElement("a");
      a.href = response.data.fileURL;
      a.download = "myexpenses.csv";
      a.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;text-align:center;">${err.message}</div>`;
  }
}

async function showLeaderBoard() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:5000/premium/showleaderboard",
      {
        headers: { Authorization: token },
      }
    );
    response.data.forEach((user) => {
      showLeaderBoardDetails(user.name, user.totalExpensesAmount);
    });
  } catch (err) {
    console.log(err);
  }
}

function showLeaderBoardDetails(name, expenseamount) {
  const parentHTML = document.getElementById("leaderBoardDetails");
  const parentNode = document.getElementById("leaderBoard");
  const childHTML = `<li> ${name} - ${expenseamount}</li>`;
  parentHTML.innerHTML = "<h2>Leader Board</h2>";
  parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    const isPremiumUser = decodeToken.isPremiumUser;
    if (isPremiumUser) {
      showPremiumUser();
    }
    const page = 1;
    const response = await axios.get(
      `http://localhost:5000/get/expenses`,
      {
        headers: { Authorization: token },
      }
    );
    showListOnScreen(response.data.expenses)
  } catch (err) {
    console.log(err);
  }
});
function showListOnScreen(expenses) {
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
  document.getElementById("amount").value = "";
  const parentNode = document.getElementById("listOfExpenses");
  parentNode.innerHTML = "";
  for (var i = 0; i < expenses.length; i++) {
    const childHTML = `<li id=${expenses[i]._id}> ${expenses[i].description} - ${expenses[i].category} -${expenses[i].amount}
                    <button onclick=deleteExpenses('${expenses[i]._id}')> Delete Expense </button>
                    </li>`;
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
  }
}
async function deleteExpenses(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `http://localhost:5000/delete/expenses/${id}`,
      { headers: { Authorization: token } }
    );
    removeExpensesFromScreen(id);
  } catch (err) {
    console.log(err);
  }
}
function removeExpensesFromScreen(id) {
  const parentNode = document.getElementById("listOfExpenses");
  const childToBeDelete = document.getElementById(id);

  parentNode.removeChild(childToBeDelete);
}

document.getElementById("razpay").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/purchase/premium", {
    headers: { Authorization: token },
  });
  var obj = {
    key: response.data.key_id,
    order_id: response.data.order.orderid,
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:5000/purchase/updatetransactionstatus",
        {
          order_id: obj.order_id,
          status: "SUCCESSFUL",
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      alert("TRANSACTION SUCCESSFUL");
      localStorage.setItem("token", res.data.token);
      showPremiumUser();
    },
  };
  const rzpnew = new Razorpay(obj);
  rzpnew.open();
  e.preventDefault();

  rzpnew.on("payment.failed", async function (response) {
    await axios.post(
      "http://localhost:5000/purchase/updatetransactionstatus",
      {
        order_id: obj.order_id,
        status: "FAILED",
        payment_id: response.razorpay_payment_id,
      },
      { headers: { Authorization: token } }
    );
    alert("TRANSACTION FAILED");
  });
};


