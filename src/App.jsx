import { useState } from "react";

export default function App() {
  const [role, setRole] = useState("founder");

  const [customers, setCustomers] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pg: "",
    paid: "",
    due: ""
  });

  const validateForm = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name || !form.phone || !form.email) {
      alert("Name, Phone and Email are required");
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("Phone must be 10 digits");
      return false;
    }

    if (!emailRegex.test(form.email)) {
      alert("Invalid email format");
      return false;
    }

    return true;
  };

  const handleAddCustomer = () => {
    if (!validateForm()) return;

    setCustomers([...customers, form]);

    setForm({
      name: "",
      phone: "",
      email: "",
      pg: "",
      paid: "",
      due: ""
    });
  };

  const handleDelete = (index) => {
    const updated = customers.filter((_, i) => i !== index);
    setCustomers(updated);
  };

  const filteredCustomers = customers.filter((c) =>
    c.phone.includes(searchPhone)
  );

  return (
    <div className="app">
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          background: #0d1117;
          color: #e6edf3;
        }

        .layout {
          display: flex;
          height: 100vh;
        }

        .sidebar {
          width: 220px;
          background: #161b22;
          padding: 20px;
          border-right: 1px solid #30363d;
        }

        .logo {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 30px;
          color: #ff4d4d;
        }

        .main {
          flex: 1;
          padding: 30px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        select {
          background: #161b22;
          border: 1px solid #30363d;
          color: white;
          padding: 8px;
          border-radius: 6px;
        }

        .card {
          background: #161b22;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #30363d;
        }

        .sectionTitle {
          margin-bottom: 15px;
          font-size: 18px;
          font-weight: 600;
        }

        input {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          background: #0d1117;
          border: 1px solid #30363d;
          color: white;
          border-radius: 6px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 10px;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
        }

        label {
          font-size: 13px;
          color: #8b949e;
        }

        .btn {
          margin-top: 20px;
          padding: 12px;
          background: #ff4d4d;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: white;
          width: 200px;
        }

        .searchBox {
          margin-bottom: 20px;
        }

        .table {
          margin-top: 25px;
        }

        .row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 12px;
          border-bottom: 1px solid #30363d;
          align-items: center;
        }

        .header {
          font-weight: bold;
          background: #0d1117;
        }

        .deleteBtn {
          background: #ff4d4d;
          border: none;
          padding: 6px 10px;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>

      <div className="layout">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="logo">RoomAdda</div>
        </div>

        {/* MAIN */}
        <div className="main">

          <div className="topbar">
            <h2>Customer Management</h2>

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="founder">Founder</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div className="card">

            {/* SEARCH */}
            <div className="searchBox">
              <input
                placeholder="Search by phone number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </div>

            {/* FORM */}
            <div className="sectionTitle">Add Customer</div>

            <div className="formGrid">

              <div className="formGroup">
                <label>Name</label>
                <input value={form.name}
                  onChange={(e)=>setForm({...form,name:e.target.value})}/>
              </div>

              <div className="formGroup">
                <label>Phone</label>
                <input value={form.phone}
                  onChange={(e)=>setForm({...form,phone:e.target.value})}/>
              </div>

              <div className="formGroup">
                <label>Email</label>
                <input value={form.email}
                  onChange={(e)=>setForm({...form,email:e.target.value})}/>
              </div>

              <div className="formGroup">
                <label>PG Name</label>
                <input value={form.pg}
                  onChange={(e)=>setForm({...form,pg:e.target.value})}/>
              </div>

              <div className="formGroup">
                <label>Paid Amount</label>
                <input value={form.paid}
                  onChange={(e)=>setForm({...form,paid:e.target.value})}/>
              </div>

              <div className="formGroup">
                <label>Due Amount</label>
                <input value={form.due}
                  onChange={(e)=>setForm({...form,due:e.target.value})}/>
              </div>

            </div>

            <button className="btn" onClick={handleAddCustomer}>
              Add Customer
            </button>

            {/* TABLE */}
            <div className="table">

              <div className="row header">
                <div>Name</div>
                <div>Phone</div>
                <div>Email</div>
                <div>PG</div>
                <div>Paid</div>
                <div>Due</div>
                <div>Action</div>
              </div>

              {filteredCustomers.map((c, i) => (
                <div className="row" key={i}>
                  <div>{c.name}</div>
                  <div>{c.phone}</div>
                  <div>{c.email}</div>
                  <div>{c.pg}</div>
                  <div>{c.paid}</div>
                  <div>{c.due}</div>

                  <div>
                    {role === "founder" && (
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(i)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}