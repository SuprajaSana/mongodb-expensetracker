async function postEmailDetails(e) {
  e.preventDefault();
  const email = e.target.email.value;

   const obj = {
     email
   };

  try {
    const response = await axios.post("http://localhost:5000/user/forgotpassword", obj);
    if (response.status === 202) {
      window.location.href = "./loginDB.html";
    } else {
      throw new Error("Failed to submit email");
    }
    document.getElementById("email").value = "";
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;text-align:center;">${err.message}</div>`;
  }
}
