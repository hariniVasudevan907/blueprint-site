import { useState } from "react";
import Login from "./Login";

const generateId = () => Math.floor(Math.random() * 1000000).toString();

export default function App() {
  const [view, setView] = useState("properties");
  const [dark, setDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [employees, setEmployees] = useState([]);

  import { useState } from "react";
  import Login from "./Login";

  const generateId = () => Math.floor(Math.random() * 1000000).toString();

  export default function App() {
    const [view, setView] = useState("properties");
    const [dark, setDark] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [employees, setEmployees] = useState([]);

    return isLoggedIn ? (
      <div className={dark ? "app dark" : "app light"}>
        <style>{`
        *{box-sizing:border-box}
        body{margin:0;font-family:Arial}

        .app{min-height:100vh;width:100vw}

        .dark{background:linear-gradient(135deg,#0f0f0f,#1a1a1a);color:white}
        .light{background:#f5f5f5;color:black}

        .topbar{display:flex;justify-content:space-between;padding:20px 40px;border-bottom:2px solid red}
        .logo{font-size:30px;font-weight:bold;color:red}
        .nav{display:flex;gap:12px}

        button{padding:10px 18px;border-radius:10px;border:none;cursor:pointer;transition:.3s}
        button:hover{background:red;color:white;transform:translateY(-2px)}

        .container{padding:40px;width:100%}

        .card{
          padding:25px;
          border-radius:16px;
          margin-bottom:30px;
          backdrop-filter:blur(10px);
        }

        .dark .card{background:rgba(255,255,255,0.05)}
        .light .card{background:white}

        input,select{
          width:100%;padding:12px;margin-top:10px;border-radius:8px;border:1px solid #444;
          background:inherit;color:inherit;transition:.2s
        }

        input:focus,select:focus{transform:scale(1.05);border-color:red}

        .formGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}

        .addBtn{
          margin-top:20px;
          width:220px;
          background:linear-gradient(45deg,red,orange);
          color:white;
          font-weight:bold;
        }

        .row{
          display:grid;
          grid-template-columns:repeat(8,1fr);
          padding:12px;
          text-align:center;
          border-radius:8px;
          margin-top:5px;
        }

        .headerRow{font-weight:bold;background:rgba(255,0,0,0.2)}
        .row:hover{background:rgba(255,255,255,0.1)}

        .searchBar{display:flex;gap:10px;margin-bottom:15px}

        .tag{padding:5px 12px;border-radius:20px;font-size:12px}
        .green{background:#00c853}
        .yellow{background:#ffab00}
        .red{background:#d50000}
      `}</style>

        <div className="topbar">
          <div className="logo">RoomAdda</div>
          <div className="nav">
            <button onClick={() => setView("customers")}>Customers</button>
            <button onClick={() => setView("properties")}>Properties</button>
            <button onClick={() => setView("employees")}>Employees</button>
            <button onClick={() => setDark(!dark)}>{dark ? "Light" : "Dark"}</button>
          </div>
        </div>

        {view === "customers" && <Customers customers={customers} setCustomers={setCustomers} properties={properties} employees={employees} />}
        {view === "properties" && <Properties properties={properties} setProperties={setProperties} customers={customers} />}
        {view === "employees" && <Employees employees={employees} setEmployees={setEmployees} />}

      </div>
    ) : (
      <Login onLogin={() => setIsLoggedIn(true)} />
    );
  }

  // ================= CUSTOMERS =================
  function Customers({ customers, setCustomers, properties, employees }) {
    const [form, setForm] = useState({ name: "", phone: "", propertyId: "", employeeId: "", visit: "Pending" });
    const [search, setSearch] = useState("");

    const add = () => {
      if (customers.find(c => c.phone === form.phone)) {
        alert("Customer already exists!");
        return;
      }
      setCustomers([...customers, { ...form, id: generateId() }]);
    }

    const filtered = customers.filter(c => c.phone.includes(search));

    return (
      <div className="container">
        <div className="card">
          <h3>Add Customer</h3>
          <div className="formGrid">
            <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Phone" onChange={e => setForm({ ...form, phone: e.target.value })} />

            <select onChange={e => setForm({ ...form, propertyId: e.target.value })}>
              <option>Select Property</option>
              {properties.map(p => (<option key={p.id}>{p.id}</option>))}
            </select>

            <select onChange={e => setForm({ ...form, employeeId: e.target.value })}>
              <option>Select Employee</option>
              {employees.map(e => (<option key={e.id}>{e.name}</option>))}
            </select>

            <select onChange={e => setForm({ ...form, visit: e.target.value })}>
              <option>Pending</option>
              <option>Visited</option>
              <option>Not Interested</option>
            </select>
          </div>
          <button className="addBtn" onClick={add}>Add Customer</button>
        </div>

        <div className="card">
          <h3>Customer List</h3>
          <div className="searchBar">
            <input placeholder="Search phone" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="row headerRow">
            <div>ID</div><div>Name</div><div>Phone</div><div>Property</div><div>Employee</div><div>Visit</div>
          </div>

          {filtered.map(c => (
            <div className="row" key={c.id}>
              <div>{c.id}</div>
              <div>{c.name}</div>
              <div>{c.phone}</div>
              <div>{c.propertyId}</div>
              <div>{c.employeeId}</div>
              <div><span className={`tag ${c.visit === "Visited" ? "green" : c.visit === "Pending" ? "yellow" : "red"}`}>{c.visit}</span></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ================= PROPERTIES =================
  function Properties({ properties, setProperties, customers }) {
    const [form, setForm] = useState({ id: "", location: "", type: "Boys", sharing: "Single", food: "Veg", rent: "", negotiable: "Yes" });
    const [search, setSearch] = useState("");

    const add = () => {
      if (properties.find(p => p.id === form.id)) {
        alert("Duplicate property ID!");
        return;
      }
      setProperties([...properties, form]);
    }

    const filtered = properties.filter(p => p.id.includes(search));

    return (
      <div className="container">
        <div className="card">
          <h3>Add Property</h3>
          <div className="formGrid">
            <input placeholder="Property ID" onChange={e => setForm({ ...form, id: e.target.value })} />
            <input placeholder="Location" onChange={e => setForm({ ...form, location: e.target.value })} />
            <select onChange={e => setForm({ ...form, type: e.target.value })}><option>Boys</option><option>Girls</option></select>
            <select onChange={e => setForm({ ...form, sharing: e.target.value })}><option>Single</option><option>Double</option></select>
            <select onChange={e => setForm({ ...form, food: e.target.value })}><option>Veg</option><option>Non-Veg</option></select>
            <input placeholder="Rent" onChange={e => setForm({ ...form, rent: e.target.value })} />
            <select onChange={e => setForm({ ...form, negotiable: e.target.value })}><option>Yes</option><option>No</option></select>
          </div>
          <button className="addBtn" onClick={add}>Add Property</button>
        </div>

        <div className="card">
          <h3>Property List</h3>
          <div className="searchBar">
            <input placeholder="Search Property ID" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="row headerRow">
            <div>ID</div><div>Location</div><div>Type</div><div>Sharing</div><div>Food</div><div>Rent</div><div>Booked By</div>
          </div>

          {filtered.map(p => {
            const cust = customers.find(c => c.propertyId === p.id);
            return (
              <div className="row" key={p.id}>
                <div>{p.id}</div>
                <div>{p.location}</div>
                <div>{p.type}</div>
                <div>{p.sharing}</div>
                <div>{p.food}</div>
                <div>{p.rent}</div>
                <div>{cust ? cust.name : "None"}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ================= EMPLOYEES =================
  function Employees({ employees, setEmployees }) {
    const [form, setForm] = useState({ name: "", id: "", dept: "", deals: "", leads: "" });
    const [search, setSearch] = useState("");

    const add = () => {
      if (employees.find(e => e.id === form.id)) {
        alert("Duplicate employee ID!");
        return;
      }
      setEmployees([...employees, form]);
    }

    const filtered = employees.filter(e => e.id.includes(search) || e.name.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="container">
        <div className="card">
          <h3>Add Employee</h3>
          <div className="formGrid">
            <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="ID" onChange={e => setForm({ ...form, id: e.target.value })} />
            <input placeholder="Department" onChange={e => setForm({ ...form, dept: e.target.value })} />
            <input placeholder="Deals" onChange={e => setForm({ ...form, deals: e.target.value })} />
            <input placeholder="Leads" onChange={e => setForm({ ...form, leads: e.target.value })} />
          </div>
          <button className="addBtn" onClick={add}>Add Employee</button>
        </div>

        <div className="card">
          <h3>Employee List</h3>

          {/* 🔍 SEARCH BAR ADDED */}
          <div className="searchBar">
            <input placeholder="Search by ID or Name" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="row headerRow">
            <div>ID</div><div>Name</div><div>Dept</div><div>Deals</div><div>Leads</div>
          </div>

          {filtered.map(e => (
            <div className="row" key={e.id}>
              <div>{e.id}</div>
              <div>{e.name}</div>
              <div>{e.dept}</div>
              <div>{e.deals}</div>
              <div>{e.leads}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }