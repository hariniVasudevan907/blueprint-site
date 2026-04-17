import { useState } from "react";

export default function App() {
  const [role, setRole] = useState("founder");
  const [view, setView] = useState("repository");

  return (
    <div className="app">
      <style>{`
        body {
          margin: 0;
          font-family: Arial;
          background: #0f0f0f;
          color: white;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: #141414;
          border-bottom: 2px solid #ff3b3b;
        }

        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #ff3b3b;
        }

        .nav {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        select, button {
          background: #1f1f1f;
          color: white;
          border: 1px solid #333;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        button:hover {
          background: #ff3b3b;
        }

        .container {
          padding: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 20px;
        }

        .card {
          background: #1b1b1b;
          padding: 15px;
          border-radius: 10px;
        }

        .smallBox {
          border: 1px solid #333;
          padding: 10px;
          margin-top: 10px;
          text-align: center;
          border-radius: 6px;
        }

        .fileGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        .file {
          height: 30px;
          background: #222;
          border: 1px solid #333;
        }

        input, textarea {
          width: 100%;
          margin-top: 8px;
          padding: 8px;
          background: #111;
          border: 1px solid #333;
          color: white;
          border-radius: 6px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .updateBtn {
          margin-top: 10px;
          padding: 10px 18px;
          background: #ff3b3b;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          width: fit-content;
        }

        .list {
          margin-top: 10px;
        }

        .row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 8px;
          border-bottom: 1px solid #222;
        }

        .headerRow {
          font-weight: bold;
          border-bottom: 2px solid #333;
        }

        .filter {
          margin-bottom: 10px;
        }

        .bubble {
          display: inline-block;
          padding: 6px 10px;
          background: #ff3b3b;
          border-radius: 20px;
          margin-bottom: 10px;
        }
      `}</style>

      {/* TOP BAR */}
      <div className="topbar">
        <div className="logo">RoomAdda</div>

        <div className="nav">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="founder">Founder</option>
            <option value="employee">Employee</option>
            <option value="customer">Customer</option>
          </select>

          <button onClick={() => setView("repository")}>Repository</button>
          <button onClick={() => setView("customers")}>Customers</button>
          <button onClick={() => setView("support")}>Support</button>
        </div>
      </div>

      {/* REPOSITORY VIEW */}
      {view === "repository" && (
        <div className="container grid">
          {/* LEFT */}
          <div className="card">
            <h3>Repository</h3>

            <div className="smallBox">Viewing</div>
            <div className="smallBox">Adding</div>

            <h4 style={{ marginTop: 15 }}>Files</h4>
            <div className="fileGrid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="file"></div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="card">
            <h3>Update / Add PG</h3>

            <div className="formGrid">
              <input placeholder="Name" />
              <input placeholder="Sharing" />
              <input placeholder="Type of PG" />
              <input placeholder="Rent" />
              <input placeholder="Negotiable Rent" />
              <input placeholder="Deposit" />
              <input placeholder="Maintenance" />
              <input placeholder="Food Menu Link" />
              <input placeholder="Video Link" />
              <input placeholder="Location" />
            </div>

            <textarea placeholder="Special Comment" rows={3} />

            {(role === "founder" || role === "employee") && (
              <button className="updateBtn">Update</button>
            )}
          </div>
        </div>
      )}

      {/* CUSTOMERS VIEW */}
      {view === "customers" && (
        <div className="container card">
          <h3>Customer Support</h3>

          <div className="filter">
            <input placeholder="Filter Type / No" />
          </div>

          <div className="row headerRow">
            <div>Customer</div>
            <div>Gender</div>
            <div>Phone</div>
            <div>Email</div>
            <div>Due Amt</div>
          </div>

          {[1, 2, 3, 4].map((i) => (
            <div className="row" key={i}>
              <div>Customer {i}</div>
              <div>Male/Female</div>
              <div>9999999999</div>
              <div>mail{i}@gmail.com</div>
              <div>0</div>
            </div>
          ))}

          {role === "founder" && <div className="bubble">+ Add Customer</div>}
        </div>
      )}

      {/* SUPPORT */}
      {view === "support" && (
        <div className="container card">
          <h3>Role Access</h3>
          <p>Founder: Full Access</p>
          <p>Employee: Limited Access</p>
          <p>Customer: View Only</p>
        </div>
      )}
    </div>
  );
}
