import { useState } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";

const generateId = () => Math.floor(Math.random() * 1000000).toString();

// ================= DASHBOARD COMPONENT =================
function Dashboard({ customers, properties, employees, leads, revenue, dark }) {
  // Statistics
  const totalRev = revenue.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const pendingRev = revenue.filter(r => r.paymentStatus !== "Paid").reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const occupiedCount = properties.filter(p => customers.some(c => c.propertyId === p.id)).length;
  const vacantCount = properties.length - occupiedCount;
  const convertedLeads = leads.filter(l => l.status === "Converted").length;

  // Mock data for charts if real data is low
  const monthlyRevenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: totalRev || 2000 },
  ];

  const leadConversionData = [
    { name: 'New', value: leads.filter(l => l.status === "New").length || 5 },
    { name: 'Contacted', value: leads.filter(l => l.status === "Contacted").length || 3 },
    { name: 'Converted', value: convertedLeads || 2 },
    { name: 'Closed', value: leads.filter(l => l.status === "Closed").length || 1 },
  ];

  const COLORS = ['#ffab00', '#2962ff', '#00c853', '#d50000'];

  const occupancyBarData = [
    { name: 'Occupied', value: occupiedCount },
    { name: 'Vacant', value: vacantCount },
  ];

  return (
    <div className="container">
      {/* 🚀 SUMMARY CARDS */}
      <div className="dashboardGrid">
        <div className="summaryCard dashboardStats">
          <div className="summaryIcon" style={{background: 'rgba(255, 0, 0, 0.2)'}}>👥</div>
          <div className="summaryContent">
            <div className="summaryTitle">Total Customers</div>
            <div className="summaryValue">{customers.length}</div>
          </div>
        </div>
        <div className="summaryCard dashboardStats">
          <div className="summaryIcon" style={{background: 'rgba(255, 171, 0, 0.2)'}}>🏠</div>
          <div className="summaryContent">
            <div className="summaryTitle">Total Properties</div>
            <div className="summaryValue">{properties.length}</div>
          </div>
        </div>
        <div className="summaryCard dashboardStats">
          <div className="summaryIcon" style={{background: 'rgba(0, 200, 83, 0.2)'}}>💰</div>
          <div className="summaryContent">
            <div className="summaryTitle">Total Revenue</div>
            <div className="summaryValue">₹{totalRev}</div>
          </div>
        </div>
        <div className="summaryCard dashboardStats">
          <div className="summaryIcon" style={{background: 'rgba(213, 0, 0, 0.2)'}}>⏳</div>
          <div className="summaryContent">
            <div className="summaryTitle">Pending Payments</div>
            <div className="summaryValue">₹{pendingRev}</div>
          </div>
        </div>
        <div className="summaryCard dashboardStats">
          <div className="summaryIcon" style={{background: 'rgba(41, 98, 255, 0.2)'}}>📈</div>
          <div className="summaryContent">
            <div className="summaryTitle">Total Leads</div>
            <div className="summaryValue">{leads.length}</div>
          </div>
        </div>
        <div className="summaryCard dashboardStats">
          <div className="summaryIcon" style={{background: 'rgba(255, 109, 0, 0.2)'}}>💼</div>
          <div className="summaryContent">
            <div className="summaryTitle">Total Employees</div>
            <div className="summaryValue">{employees.length}</div>
          </div>
        </div>
      </div>

      {/* 📊 CHARTS SECTION */}
      <div className="chartGrid">
        <div className="card chartCard">
          <h3>Monthly Revenue</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="red" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="red" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={dark ? "#444" : "#ddd"} />
                <XAxis dataKey="name" stroke={dark ? "#ccc" : "#666"} />
                <YAxis stroke={dark ? "#ccc" : "#666"} />
                <Tooltip 
                   contentStyle={{backgroundColor: dark ? '#222' : '#fff', border: '1px solid #444', borderRadius: '8px'}}
                />
                <Area type="monotone" dataKey="value" stroke="red" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chartCard">
          <h3>Lead Status</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={leadConversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadConversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: dark ? '#222' : '#fff', border: '1px solid #444', borderRadius: '8px'}}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chartCard">
           <h3>Occupancy Stats</h3>
           <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
               <BarChart data={occupancyBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={dark ? "#444" : "#ddd"} />
                  <XAxis dataKey="name" stroke={dark ? "#ccc" : "#666"} />
                  <YAxis stroke={dark ? "#ccc" : "#666"} />
                  <Tooltip 
                     cursor={{fill: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
                     contentStyle={{backgroundColor: dark ? '#222' : '#fff', border: '1px solid #444', borderRadius: '8px'}}
                  />
                  <Bar dataKey="value" fill="red" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* 🕒 RECENT ACTIVITY SECTION */}
      <div className="activityGrid">
        <div className="card activityCard">
          <h3>Recent Customers</h3>
          <div className="tableWrapper" style={{maxHeight: '300px'}}>
            <div className="row headerRow" style={{gridTemplateColumns: 'repeat(3, 1fr)', fontSize: '13px'}}>
               <div>Name</div><div>Property</div><div>Status</div>
            </div>
            {customers.length === 0 ? <p style={{textAlign: 'center', opacity: 0.5}}>No data yet</p> : 
               customers.slice(-5).reverse().map(c => (
                <div className="row" key={c.id} style={{gridTemplateColumns: 'repeat(3, 1fr)', fontSize: '13px'}}>
                  <div>{c.name}</div><div>{c.propertyId}</div><div><span className={`tag ${c.visit === 'Visited' ? 'green' : 'yellow'}`}>{c.visit}</span></div>
                </div>
               ))
            }
          </div>
        </div>

        <div className="card activityCard">
          <h3>Recent Revenue</h3>
          <div className="tableWrapper" style={{maxHeight: '300px'}}>
            <div className="row headerRow" style={{gridTemplateColumns: 'repeat(3, 1fr)', fontSize: '13px'}}>
               <div>Customer</div><div>Amount</div><div>Status</div>
            </div>
            {revenue.length === 0 ? <p style={{textAlign: 'center', opacity: 0.5}}>No data yet</p> : 
               revenue.slice(-5).reverse().map(r => (
                <div className="row" key={r.id} style={{gridTemplateColumns: 'repeat(3, 1fr)', fontSize: '13px'}}>
                  <div>{r.customerName}</div><div>₹{r.amount}</div><div><span className={`tag ${r.paymentStatus === 'Paid' ? 'green' : 'orange'}`}>{r.paymentStatus}</span></div>
                </div>
               ))
            }
          </div>
        </div>

        <div className="card activityCard">
          <h3>Vacant Properties</h3>
          <div className="tableWrapper" style={{maxHeight: '300px'}}>
            <div className="row headerRow" style={{gridTemplateColumns: 'repeat(2, 1fr)', fontSize: '13px'}}>
               <div>Property ID</div><div>Location</div>
            </div>
            {properties.filter(p => !customers.some(c => c.propertyId === p.id)).length === 0 ? <p style={{textAlign: 'center', opacity: 0.5}}>No vacancies</p> : 
               properties.filter(p => !customers.some(c => c.propertyId === p.id)).slice(0, 5).map(p => (
                <div className="row" key={p.id} style={{gridTemplateColumns: 'repeat(2, 1fr)', fontSize: '13px'}}>
                  <div>{p.id}</div><div>{p.location}</div>
                </div>
               ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard"); // Dashboard as default
  const [dark, setDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState("login");

  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [revenue, setRevenue] = useState([]);

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
        transition: 0.3s;
      }

      .dark .card{background:rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05)}
      .light .card{background:white; box-shadow: 0 4px 20px rgba(0,0,0,0.05)}

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
        padding:12px;
        text-align:center;
        border-radius:8px;
        margin-top:5px;
      }

      .headerRow{font-weight:bold;background:rgba(255,0,0,0.2)}
      .row:hover{background:rgba(255,255,255,0.1)}

      .searchBar{display:flex;gap:10px;margin-bottom:15px}

      .tag{padding:5px 12px;border-radius:20px;font-size:11px;display:inline-block;font-weight: bold;}
      .green{background:#00c853;color:white;}
      .yellow{background:#ffab00;color:black;}
      .red{background:#d50000;color:white;}
      .blue{background:#2962ff;color:white;}
      .orange{background:#ff6d00;color:white;}

      .tableWrapper{width:100%;overflow-x:auto}
      
      /* Dashboard Specific Styles */
      .dashboardGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 30px;
      }

      .summaryCard.dashboardStats {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        border-radius: 16px;
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.05);
        transition: 0.3s;
      }

      .summaryCard.dashboardStats:hover {
        transform: translateY(-5px);
        background: rgba(255,255,255,0.1);
        border-color: red;
      }

      .summaryIcon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }

      .summaryTitle { font-size: 13px; color: #aaa; margin-bottom: 4px; }
      .light .summaryTitle { color: #555; }
      .summaryValue { font-size: 22px; font-weight: bold; }

      .chartGrid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
      }

      .chartCard h3, .activityCard h3 {
        margin: 0 0 15px 0;
        font-size: 16px;
        color: red;
      }

      .activityGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      /* Media Queries for Mobile Responsiveness */
      @media(max-width:1200px){
        .chartGrid { grid-template-columns: 1fr; }
        .dashboardGrid { grid-template-columns: repeat(2, 1fr); }
        .activityGrid { grid-template-columns: 1fr; }
      }

      @media(max-width:900px){
        .formGrid{grid-template-columns:1fr;gap:10px;}
        .nav{flex-wrap:wrap;justify-content:center;margin-top:10px;}
        .topbar{flex-direction:column;align-items:center;padding:15px;}
        .dashboardGrid { grid-template-columns: 1fr; }
      }
    `}</style>

      <div className="topbar">
        <div className="logo">RoomAdda</div>
        <div className="nav">
          <button onClick={() => setView("dashboard")}>Dashboard</button>
          <button onClick={() => setView("customers")}>Customers</button>
          <button onClick={() => setView("properties")}>Properties</button>
          <button onClick={() => setView("employees")}>Employees</button>
          <button onClick={() => setView("leads")}>Leads</button>
          <button onClick={() => setView("revenue")}>Revenue</button>
          <button onClick={() => setDark(!dark)}>{dark ? "Light" : "Dark"}</button>
        </div>
      </div>

      {view === "dashboard" && <Dashboard customers={customers} properties={properties} employees={employees} leads={leads} revenue={revenue} dark={dark} />}
      {view === "customers" && <Customers customers={customers} setCustomers={setCustomers} properties={properties} employees={employees} />}
      {view === "properties" && <Properties properties={properties} setProperties={setProperties} customers={customers} />}
      {view === "employees" && <Employees employees={employees} setEmployees={setEmployees} />}
      {view === "leads" && <Leads leads={leads} setLeads={setLeads} />}
      {view === "revenue" && <Revenue revenue={revenue} setRevenue={setRevenue} />}

    </div>
  ) : (
    <>
      {authView === "login" && (
        <Login
          onLogin={() => setIsLoggedIn(true)}
          onSwitchToSignup={() => setAuthView("signup")}
          onSwitchToForgot={() => setAuthView("forgot")}
        />
      )}

      {authView === "signup" && (
        <Signup onSwitchToLogin={() => setAuthView("login")} />
      )}

      {authView === "forgot" && (
        <ForgotPassword onSwitchToLogin={() => setAuthView("login")} />
      )}
    </>
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

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            <div>ID</div><div>Name</div><div>Phone</div><div>Property</div><div>Employee</div><div>Visit</div>
          </div>

          {filtered.map(c => (
            <div className="row" key={c.id} style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
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

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            <div>ID</div><div>Location</div><div>Type</div><div>Sharing</div><div>Food</div><div>Rent</div><div>Booked By</div>
          </div>

          {filtered.map(p => {
            const cust = customers.find(c => c.propertyId === p.id);
            return (
              <div className="row" key={p.id} style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
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
          <input placeholder="Deals" t onChange={e => setForm({ ...form, deals: e.target.value })} />
          <input placeholder="Leads" onChange={e => setForm({ ...form, leads: e.target.value })} />
        </div>
        <button className="addBtn" onClick={add}>Add Employee</button>
      </div>

      <div className="card">
        <h3>Employee List</h3>
        <div className="searchBar">
          <input placeholder="Search by ID or Name" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            <div>ID</div><div>Name</div><div>Dept</div><div>Deals</div><div>Leads</div>
          </div>

          {filtered.map(e => (
            <div className="row" key={e.id} style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              <div>{e.id}</div>
              <div>{e.name}</div>
              <div>{e.dept}</div>
              <div>{e.deals}</div>
              <div>{e.leads}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ================= LEADS =================
function Leads({ leads, setLeads }) {
  const [form, setForm] = useState({ name: "", phone: "", type: "", budget: "", source: "Instagram", status: "New" });
  const [search, setSearch] = useState("");

  const add = () => {
    if (!form.name || !form.phone || !form.type || !form.budget) {
      alert("Please fill all required fields!");
      return;
    }
    if (leads.find(l => l.phone === form.phone)) {
      alert("Lead with this phone number already exists!");
      return;
    }
    setLeads([...leads, { ...form, id: generateId() }]);
  }

  const filtered = leads.filter(l => l.phone.includes(search) || l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container">
      <div className="card">
        <h3>Add Lead</h3>
        <div className="formGrid">
          <input placeholder="Lead Name" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Phone Number" onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Interested Property Type" onChange={e => setForm({ ...form, type: e.target.value })} />
          <input placeholder="Budget" onChange={e => setForm({ ...form, budget: e.target.value })} />
          <select onChange={e => setForm({ ...form, source: e.target.value })}>
            <option>Instagram</option>
            <option>WhatsApp</option>
            <option>Referral</option>
            <option>Website</option>
            <option>Walk-in</option>
          </select>
          <select onChange={e => setForm({ ...form, status: e.target.value })}>
            <option>New</option>
            <option>Contacted</option>
            <option>Converted</option>
            <option>Closed</option>
          </select>
        </div>
        <button className="addBtn" onClick={add}>Add Lead</button>
      </div>

      <div className="card">
        <h3>Leads List</h3>
        <div className="searchBar">
          <input placeholder="Search by Name or Phone" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            <div>ID</div><div>Name</div><div>Phone</div><div>Type</div><div>Budget</div><div>Source</div><div>Status</div>
          </div>

          {filtered.map(l => (
            <div className="row" key={l.id} style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
              <div>{l.id}</div>
              <div>{l.name}</div>
              <div>{l.phone}</div>
              <div>{l.type}</div>
              <div>{l.budget}</div>
              <div>{l.source}</div>
              <div>
                <span className={`tag ${l.status === "New" ? "yellow" : l.status === "Contacted" ? "blue" : l.status === "Converted" ? "green" : "red"}`}>
                  {l.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ================= REVENUE =================
function Revenue({ revenue, setRevenue }) {
  const [form, setForm] = useState({ id: "", customerName: "", propertyId: "", amount: "", paymentStatus: "Paid", paymentMode: "Cash", date: "" });
  const [search, setSearch] = useState("");

  const add = () => {
    if (!form.id || !form.customerName || !form.amount) {
      alert("Please fill all required fields!");
      return;
    }
    if (isNaN(form.amount)) {
      alert("Amount should be numeric!");
      return;
    }
    if (revenue.find(r => r.id === form.id)) {
      alert("Duplicate Revenue ID!");
      return;
    }
    setRevenue([...revenue, form]);
  }

  const filtered = revenue.filter(r => r.id.includes(search) || r.customerName.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = revenue.reduce((sum, r) => sum + Number(r.amount), 0);
  const paidRevenue = revenue.filter(r => r.paymentStatus === "Paid").reduce((sum, r) => sum + Number(r.amount), 0);
  const pendingRevenue = revenue.filter(r => r.paymentStatus === "Pending" || r.paymentStatus === "Partial").reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="container">
      <div className="summaryCards">
        <div className="summaryCard">
          <div className="summaryTitle">Total Revenue</div>
          <div className="summaryValue">₹{totalRevenue}</div>
        </div>
        <div className="summaryCard">
          <div className="summaryTitle">Paid Revenue</div>
          <div className="summaryValue" style={{ color: '#00c853' }}>₹{paidRevenue}</div>
        </div>
        <div className="summaryCard">
          <div className="summaryTitle">Pending/Partial</div>
          <div className="summaryValue" style={{ color: '#ffab00' }}>₹{pendingRevenue}</div>
        </div>
        <div className="summaryCard">
          <div className="summaryTitle">Transactions</div>
          <div className="summaryValue">{revenue.length}</div>
        </div>
      </div>

      <div className="card">
        <h3>Add Revenue</h3>
        <div className="formGrid">
          <input placeholder="Revenue ID" onChange={e => setForm({ ...form, id: e.target.value })} />
          <input placeholder="Customer Name" onChange={e => setForm({ ...form, customerName: e.target.value })} />
          <input placeholder="Property ID" onChange={e => setForm({ ...form, propertyId: e.target.value })} />
          <input placeholder="Amount" onChange={e => setForm({ ...form, amount: e.target.value })} />
          <select onChange={e => setForm({ ...form, paymentStatus: e.target.value })}>
            <option>Paid</option>
            <option>Pending</option>
            <option>Partial</option>
          </select>
          <select onChange={e => setForm({ ...form, paymentMode: e.target.value })}>
            <option>Cash</option>
            <option>UPI</option>
            <option>Bank Transfer</option>
          </select>
          <input type="date" style={{ colorScheme: 'dark' }} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <button className="addBtn" onClick={add}>Add Revenue</button>
      </div>

      <div className="card">
        <h3>Revenue List</h3>
        <div className="searchBar">
          <input placeholder="Search by Revenue ID or Customer Name" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            <div>Rev ID</div><div>Customer</div><div>Property</div><div>Amount</div><div>Mode</div><div>Date</div><div>Status</div>
          </div>

          {filtered.map(r => (
            <div className="row" key={r.id} style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
              <div>{r.id}</div>
              <div>{r.customerName}</div>
              <div>{r.propertyId}</div>
              <div>{r.amount}</div>
              <div>{r.paymentMode}</div>
              <div>{r.date}</div>
              <div>
                <span className={`tag ${r.paymentStatus === "Paid" ? "green" : r.paymentStatus === "Pending" ? "yellow" : "orange"}`}>
                  {r.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}