import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";

const generateId = () => Math.floor(Math.random() * 1000000).toString();

// ================= DASHBOARD COMPONENT =================
function Dashboard({
  attendanceStatus, setAttendanceStatus,
  attendanceHistory, setAttendanceHistory,
  workDiaryUrl, setWorkDiaryUrl,
  workDiaries, setWorkDiaries
}) {
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Calculate working hours from two time strings (HH:MM AM/PM format)
  const calcHours = (inTime, outTime) => {
    if (!inTime || !outTime) return '--:--';
    const toMins = (t) => {
      const [time, meridiem] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (meridiem === 'PM' && h !== 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    const diff = toMins(outTime) - toMins(inTime);
    if (diff <= 0) return '--:--';
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const handlePunchIn = () => {
    setAttendanceStatus({
      ...attendanceStatus,
      isPresent: true,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      logoutTime: null,
      workingHours: null,
    });
  };

  const handlePunchOut = () => {
    const logoutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const workingHours = calcHours(attendanceStatus.loginTime, logoutTime);
    setAttendanceStatus({ ...attendanceStatus, isPresent: false, logoutTime, workingHours });
    setAttendanceHistory([
      { id: generateId(), date: currentDate, loginTime: attendanceStatus.loginTime, logoutTime, status: 'Present', hours: workingHours },
      ...attendanceHistory
    ]);
  };

  const handleSaveDiary = () => {
    if (workDiaryUrl) {
      setWorkDiaries([{ id: generateId(), url: workDiaryUrl, date: currentDate }, ...workDiaries]);
      setWorkDiaryUrl('');
      alert('Diary Link Saved!');
    }
  };

  // Sample attendance table data (static demo rows)
  const sampleAttendance = [
    { id: 'a1', date: '21/04/2026', type: 'Regular', status: 'Present' },
    { id: 'a2', date: '20/04/2026', type: 'Regular', status: 'Present' },
    { id: 'a3', date: '19/04/2026', type: 'Regular', status: 'Absent' },
    { id: 'a4', date: '18/04/2026', type: 'Regular', status: 'Present' },
    { id: 'a5', date: '17/04/2026', type: 'Regular', status: 'Present' },
  ];
  const allRows = [...attendanceHistory.map(r => ({ id: r.id, date: r.date, type: 'Regular', status: r.status })), ...sampleAttendance];
  const presentCount = allRows.filter(r => r.status === 'Present').length;
  const attendanceRate = allRows.length ? Math.round((presentCount / allRows.length) * 100) : 0;

  return (
    <div className="container">

      {/* ── Welcome Banner ── */}
      <div className="dashboardBanner">
        <div className="bannerText">
          <h1>Team Member Dashboard</h1>
          <p>Welcome back, Dev Prashob!</p>
        </div>
      </div>

      {/* ── Main 2-column grid ── */}
      <div className="dashboardMainGrid">

        {/* ── LEFT: Profile + Work Diary ── */}
        <div className="card profileCard" style={{ marginBottom: 0 }}>

          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#ff1a1a,#ff7b00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', color: 'white', fontWeight: 'bold'
            }}>JD</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '2px' }}>Dev Prashob</div>
              <div style={{ fontSize: '12px', opacity: 0.65 }}>Manager · Technical dept</div>
            </div>
          </div>

          {/* Profile info table */}
          <div className="profileInfo">
            {[
              ['Employee ID', 'EMP-10234'],
              ['Reg No', 'REG-2024-07'],
              ['Role', 'Manager'],
              ['Type', 'Full-Time'],
              ['Level', 'Senior'],
              ['Contact', '+91 9876543210'],
              ['Email', 'devprashob.ra@gmail.com'],
              ['Department', 'Technical'],
            ].map(([label, val]) => (
              <div className="profileRow" key={label}>
                <span className="profileLabel">{label}</span>
                <span className="profileVal">{val}</span>
              </div>
            ))}
          </div>

          {/* Stat mini-cards */}
          <div className="statRow">
            <div className="statBox">
              <div className="statNum">{attendanceRate}%</div>
              <div className="statLbl">Attendance</div>
            </div>
            <div className="statBox">
              <div className="statNum">{presentCount * 8}h</div>
              <div className="statLbl">Total Hours</div>
            </div>
            <div className="statBox">
              <div className="statNum" style={{ color: attendanceRate >= 80 ? '#00c853' : attendanceRate >= 60 ? '#ffab00' : '#d50000' }}>
                {attendanceRate >= 80 ? 'Excellent' : attendanceRate >= 60 ? 'Good' : 'Average'}
              </div>
              <div className="statLbl">Status</div>
            </div>
          </div>

          {/* Work Diary section */}
          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(128,128,128,0.2)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', opacity: 0.8 }}>📓 Work Diary</div>
            <input
              placeholder="Paste your Work Diary URL..."
              value={workDiaryUrl}
              onChange={e => setWorkDiaryUrl(e.target.value)}
              style={{ marginTop: 0, marginBottom: '10px', fontSize: '13px', padding: '9px 12px' }}
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleSaveDiary}
                style={{ flex: 1, minWidth: '80px', fontSize: '12px', padding: '8px', background: 'linear-gradient(45deg,#ff1a1a,#ff7b00)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >💾 Save</button>
              <button
                onClick={() => workDiaryUrl && window.open(workDiaryUrl, '_blank')}
                style={{ flex: 1, minWidth: '70px', fontSize: '12px', padding: '8px', background: 'rgba(255,123,0,0.12)', color: '#ff7b00', borderRadius: '8px', border: '1px solid #ff7b00', cursor: 'pointer' }}
              >🔗 View</button>
              <button
                onClick={() => { navigator.clipboard.writeText(workDiaryUrl); alert('Copied!'); }}
                style={{ flex: 1, minWidth: '70px', fontSize: '12px', padding: '8px', background: 'rgba(128,128,128,0.1)', borderRadius: '8px', border: '1px solid rgba(128,128,128,0.3)', cursor: 'pointer', color: 'inherit' }}
              >📋 Copy</button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Attendance Record ── */}
        <div className="card attendanceCard" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>📅 Attendance Record</div>

          {/* 3 summary boxes */}
          <div className="statRow" style={{ marginBottom: '14px' }}>
            <div className="statBox">
              <div className="statNum">{allRows.length}</div>
              <div className="statLbl">Total Events</div>
            </div>
            <div className="statBox">
              <div className="statNum" style={{ color: '#00c853' }}>{presentCount}</div>
              <div className="statLbl">Present</div>
            </div>
            <div className="statBox">
              <div className="statNum" style={{ color: '#ff7b00' }}>{attendanceRate}%</div>
              <div className="statLbl">Rate</div>
            </div>
          </div>

          {/* Punch buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <button
              onClick={handlePunchIn}
              disabled={attendanceStatus.isPresent}
              style={{ flex: 1, padding: '9px', fontSize: '13px', background: attendanceStatus.isPresent ? '#555' : '#00c853', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >Punch In</button>
            <button
              onClick={handlePunchOut}
              disabled={!attendanceStatus.isPresent}
              style={{ flex: 1, padding: '9px', fontSize: '13px', background: !attendanceStatus.isPresent ? '#555' : '#d50000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >Punch Out</button>
          </div>

          {/* Time row */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', fontSize: '12px' }}>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.08)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ opacity: 0.6, marginBottom: '2px' }}>Login</div>
              <strong>{attendanceStatus.loginTime || '--:--'}</strong>
            </div>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.08)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ opacity: 0.6, marginBottom: '2px' }}>Logout</div>
              <strong>{attendanceStatus.logoutTime || '--:--'}</strong>
            </div>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.08)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ opacity: 0.6, marginBottom: '2px' }}>Hours</div>
              <strong style={{ color: '#ff7b00' }}>{attendanceStatus.isPresent ? 'Active' : (attendanceStatus.workingHours || '--:--')}</strong>
            </div>
          </div>

          {/* Attendance table */}
          <div className="tableWrapper">
            <table className="attendanceTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allRows.slice(0, 8).map(r => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>{r.type}</td>
                    <td>
                      <span className={`tag ${r.status === 'Present' ? 'green' : 'red'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {allRows.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', opacity: 0.5, padding: '14px' }}>No records yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>{/* end dashboardMainGrid */}

      {/* ── Lead Performance ── */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>📊 Lead Performance &amp; Conversion</div>
        <div className="leadStatsGrid">
          {[
            { label: 'Total Leads', value: '48', color: '#ff1a1a' },
            { label: 'Active Leads', value: '21', color: '#ff7b00' },
            { label: 'Converted', value: '12', color: '#00c853' },
            { label: 'Conversion Rate', value: '25%', color: '#ffab00' },
          ].map(s => (
            <div key={s.label} className="leadStatBox" style={{ '--accent': s.color }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mission Card ── */}
      <div className="missionCard">
        <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>🎯 PG Aggregator Mission</div>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.7', opacity: 0.85 }}>
          At RoomAdda, our mission is to help students and working professionals find safe, affordable, and comfortable
          living spaces across the city. Every lead you follow up on, every customer you help — brings someone closer
          to a place they can call home. Keep going! 🚀
        </p>
      </div>

    </div>
  );
}

// ================= APP COMPONENT =================
export default function App() {
  const [view, setView] = useState("dashboard");
  const [dark, setDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState("login");

  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);

  // NOTE: Revenue state is kept but unused as per requirement
  // const [revenue, setRevenue] = useState([]);

  // Employee focused states
  const [attendanceStatus, setAttendanceStatus] = useState({ isPresent: false, loginTime: null, logoutTime: null });
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [workDiaryUrl, setWorkDiaryUrl] = useState("");
  const [workDiaries, setWorkDiaries] = useState([]);

  return isLoggedIn ? (
    <div className={dark ? "app dark" : "app light"}>
      <style>{`
      *{box-sizing:border-box}
      body{margin:0;font-family:Arial}

      .app{min-height:100vh;width:100vw; overflow-x: hidden}

      .dark{background:linear-gradient(135deg,#0f0f0f,#1a1a1a);color:white}
      .light{background:#f5f5f5;color:black}

      .topbar{display:flex;justify-content:space-between;padding:20px 40px;border-bottom:2px solid red; align-items: center;}
      .logo{font-size:30px;font-weight:bold;color:red}
      .nav{display:flex;gap:12px; flex-wrap: wrap;}

      button{padding:10px 18px;border-radius:10px;border:none;cursor:pointer;transition:.3s}
      button:hover{background:red;color:white;transform:translateY(-2px)}
      button:disabled{opacity: 0.5; cursor: not-allowed; transform: none;}

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
        align-items: center;
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
      
      /* ── Dashboard layout classes ── */
      .dashboardGrid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-bottom:30px; }

      /* Welcome banner — red/orange RoomAdda gradient */
      .dashboardBanner {
        display:flex; align-items:center;
        background: linear-gradient(135deg,#ff1a1a,#ff4d00,#ff7a00);
        border-radius:24px; padding:35px 40px;
        min-height:150px; margin-bottom:18px;
        box-shadow:0 6px 28px rgba(255,60,0,0.35);
        transition: transform 0.25s, box-shadow 0.25s;
      }
      .dashboardBanner:hover {
        transform: translateY(-2px);
        box-shadow:0 10px 32px rgba(255,60,0,0.45);
      }
      .bannerText { display:flex; flex-direction:column; justify-content:center; }
      .dashboardBanner h1 {
        font-size:30px; font-weight:700; color:white;
        margin:0 0 10px 0; line-height:1.2;
      }
      .dashboardBanner p {
        font-size:17px; color:rgba(255,255,255,0.85);
        margin:0; font-weight:400;
      }
      @media(max-width:700px){
        .dashboardBanner { padding:24px 20px; min-height:auto; border-radius:16px; }
        .dashboardBanner h1 { font-size:22px; }
        .dashboardBanner p  { font-size:14px; }
      }

      /* Main 2-col grid */
      .dashboardMainGrid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }

      /* Profile info table */
      .profileInfo { border-top:1px solid rgba(255,100,0,0.18); }
      .profileRow {
        display:flex; justify-content:space-between; align-items:center;
        padding:7px 0; border-bottom:1px solid rgba(255,100,0,0.1);
        font-size:13px;
      }
      .profileLabel { opacity:0.6; font-size:12px; }
      .profileVal   { font-weight:600; font-size:13px; text-align:right; }

      /* Stat row */
      .statRow { display:flex; gap:10px; margin-top:14px; }
      .statBox {
        flex:1; background:rgba(255,60,0,0.07); border:1px solid rgba(255,60,0,0.2);
        border-radius:10px; padding:10px 8px; text-align:center;
      }
      .statNum { font-size:18px; font-weight:800; line-height:1; margin-bottom:4px; color:#ff7b00; }
      .statLbl { font-size:10px; opacity:0.6; text-transform:uppercase; letter-spacing:.5px; }

      /* Attendance table */
      .attendanceTable { width:100%; border-collapse:collapse; font-size:13px; min-width:320px; }
      .attendanceTable th {
        text-align:left; padding:8px 10px; font-size:11px; text-transform:uppercase;
        letter-spacing:.5px; color:#ff7b00; border-bottom:2px solid rgba(255,123,0,0.3);
      }
      .attendanceTable td { padding:7px 10px; border-bottom:1px solid rgba(255,60,0,0.08); }
      .attendanceTable tr:hover td { background:rgba(255,60,0,0.05); }

      /* Lead stats */
      .leadStatsGrid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
      .leadStatBox {
        background:rgba(255,30,0,0.06); border:1px solid rgba(255,60,0,0.18);
        border-radius:10px; padding:14px 12px; text-align:center;
        transition:transform .2s;
      }
      .leadStatBox:hover { transform:translateY(-2px); box-shadow:0 4px 14px rgba(255,60,0,0.15); }

      /* Mission card */
      .missionCard {
        border-radius:12px; padding:16px 20px; margin-top:0;
        border-left:4px solid #ff7b00;
        background:rgba(255,100,0,0.07);
      }

      @media(max-width:1100px){
        .dashboardMainGrid { grid-template-columns:1fr; }
        .leadStatsGrid     { grid-template-columns:repeat(2,1fr); }
      }

      @media(max-width:900px){
        .formGrid{grid-template-columns:1fr;gap:10px;}
        .nav{flex-wrap:wrap;justify-content:center;margin-top:10px;}
        .topbar{flex-direction:column;align-items:center;padding:15px;}
        .card{padding:15px;}
        .dashboardGrid { grid-template-columns:1fr; }
        .statRow { flex-wrap:wrap; }
        .statBox { min-width:80px; }
        .welcomeBanner { flex-direction:column; align-items:flex-start; gap:8px; }
      }

      @media(max-width:600px){
        .leadStatsGrid { grid-template-columns:repeat(2,1fr); }
        .container { padding:16px; }
      }
      `}</style>

      <div className="topbar">
        <div className="logo">RoomAdda</div>
        <div className="nav">
          <button onClick={() => setView("dashboard")} style={{ background: view === 'dashboard' ? 'red' : '', color: view === 'dashboard' ? 'white' : '' }}>Dashboard</button>
          <button onClick={() => setView("customers")} style={{ background: view === 'customers' ? 'red' : '', color: view === 'customers' ? 'white' : '' }}>Customers</button>
          <button onClick={() => setView("leads")} style={{ background: view === 'leads' ? 'red' : '', color: view === 'leads' ? 'white' : '' }}>Leads</button>
          <button onClick={() => setView("properties")} style={{ background: view === 'properties' ? 'red' : '', color: view === 'properties' ? 'white' : '' }}>Properties</button>
          <button onClick={() => setView("employees")} style={{ background: view === 'employees' ? 'red' : '', color: view === 'employees' ? 'white' : '' }}>Employees</button>
          <button onClick={() => setView("attendance")} style={{ background: view === 'attendance' ? 'red' : '', color: view === 'attendance' ? 'white' : '' }}>Attendance</button>
          <button onClick={() => setView("diary")} style={{ background: view === 'diary' ? 'red' : '', color: view === 'diary' ? 'white' : '' }}>Work Diary</button>
          <button onClick={() => setDark(!dark)}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
        </div>
      </div>

      {view === "dashboard" && <Dashboard
        attendanceStatus={attendanceStatus} setAttendanceStatus={setAttendanceStatus}
        attendanceHistory={attendanceHistory} setAttendanceHistory={setAttendanceHistory}
        workDiaryUrl={workDiaryUrl} setWorkDiaryUrl={setWorkDiaryUrl}
        workDiaries={workDiaries} setWorkDiaries={setWorkDiaries}
      />}
      {view === "customers" && <Customers customers={customers} />}
      {view === "leads" && <Leads leads={leads} />}
      {view === "properties" && <Properties properties={properties} setProperties={setProperties} customers={customers} />}
      {view === "employees" && <Employees employees={employees} setEmployees={setEmployees} />}
      {view === "attendance" && <Attendance
        attendanceStatus={attendanceStatus} setAttendanceStatus={setAttendanceStatus}
        attendanceHistory={attendanceHistory} setAttendanceHistory={setAttendanceHistory}
      />}
      {view === "diary" && <WorkDiary
        workDiaryUrl={workDiaryUrl} setWorkDiaryUrl={setWorkDiaryUrl}
        workDiaries={workDiaries} setWorkDiaries={setWorkDiaries}
      />}
      {/* Revenue hidden for future admin-only use */}
    </div>
  ) : (
    <>
      {authView === "login" && <Login onLogin={() => setIsLoggedIn(true)} onSwitchToSignup={() => setAuthView("signup")} onSwitchToForgot={() => setAuthView("forgot")} />}
      {authView === "signup" && <Signup onSwitchToLogin={() => setAuthView("login")} />}
      {authView === "forgot" && <ForgotPassword onSwitchToLogin={() => setAuthView("login")} />}
    </>
  );
}

// ================= CUSTOMERS =================
function Customers({ customers }) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(c => c.phone?.includes(search) || c.name?.toLowerCase().includes(search.toLowerCase())).slice(0, 50);

  return (
    <div className="container">
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0 }}>Recent Customers (Max 50)</h3>
        <div className="searchBar">
          <input placeholder="Search by name or phone" value={search} onChange={e => setSearch(e.target.value)} style={{ marginTop: 0 }} />
          <select style={{ marginTop: 0, width: '200px' }}>
            <option>All Filters</option>
            <option>Visited</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="tableWrapper">
          <div className="row headerRow attendanceTable" style={{ gridTemplateColumns: 'repeat(7, 1fr)', minWidth: '900px' }}>
            <div>Customer Name</div><div>Phone Number</div><div>Assigned Employee</div><div>Interested Property</div><div>Visit Status</div><div>Lead Source</div><div>Date Added</div>
          </div>

          {filtered.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5 }}>No customers match</p> : filtered.map(c => (
            <div className="row" key={c.id} style={{ gridTemplateColumns: 'repeat(7, 1fr)', minWidth: '900px' }}>
              <div>{c.name || "N/A"}</div>
              <div>{c.phone || "N/A"}</div>
              <div>{c.employeeId || "Unassigned"}</div>
              <div>{c.propertyId || "General"}</div>
              <div><span className={`tag ${c.visit === "Visited" ? "green" : c.visit === "Pending" ? "yellow" : "red"}`}>{c.visit || "Pending"}</span></div>
              <div>{c.source || "Unknown"}</div>
              <div>{c.dateAdded || new Date().toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ================= LEADS =================
function Leads({ leads }) {
  const [search, setSearch] = useState("");

  const filtered = leads.filter(l => l.phone?.includes(search) || l.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container">
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0 }}>Leads List</h3>
        <div className="searchBar">
          <input placeholder="Search by Name or Phone" value={search} onChange={e => setSearch(e.target.value)} style={{ marginTop: 0 }} />
          <select style={{ marginTop: 0, width: '200px' }}>
            <option>All Types</option>
            <option>New</option>
            <option>Contacted</option>
          </select>
        </div>

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(6, 1fr)', minWidth: '800px' }}>
            <div>Lead Name</div><div>Phone Number</div><div>Source</div><div>Status</div><div>Assigned Employee</div><div>Follow-up Date</div>
          </div>

          {filtered.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5 }}>No leads found</p> : filtered.map(l => (
            <div className="row" key={l.id} style={{ gridTemplateColumns: 'repeat(6, 1fr)', minWidth: '800px' }}>
              <div>{l.name || "N/A"}</div>
              <div>{l.phone || "N/A"}</div>
              <div>{l.source || "N/A"}</div>
              <div>
                <span className={`tag ${l.status === "New" ? "yellow" : l.status === "Contacted" ? "blue" : l.status === "Converted" ? "green" : "red"}`}>
                  {l.status || "New"}
                </span>
              </div>
              <div>{l.employeeId || "Unassigned"}</div>
              <div>{l.followUp || new Date().toLocaleDateString()}</div>
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
        <h3 style={{ color: 'red', marginTop: 0 }}>Add Property</h3>
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
        <h3 style={{ color: 'red', marginTop: 0 }}>Property List</h3>
        <div className="searchBar">
          <input placeholder="Search Property ID" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(7, 1fr)', minWidth: '800px' }}>
            <div>ID</div><div>Location</div><div>Type</div><div>Sharing</div><div>Food</div><div>Rent</div><div>Booked By</div>
          </div>

          {filtered.map(p => {
            const cust = customers.find(c => c.propertyId === p.id);
            return (
              <div className="row" key={p.id} style={{ gridTemplateColumns: 'repeat(7, 1fr)', minWidth: '800px' }}>
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
        <h3 style={{ color: 'red', marginTop: 0 }}>Add Employee</h3>
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
        <h3 style={{ color: 'red', marginTop: 0 }}>Employee List</h3>
        <div className="searchBar">
          <input placeholder="Search by ID or Name" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(5, 1fr)', minWidth: '600px' }}>
            <div>ID</div><div>Name</div><div>Dept</div><div>Deals</div><div>Leads</div>
          </div>

          {filtered.map(e => (
            <div className="row" key={e.id} style={{ gridTemplateColumns: 'repeat(5, 1fr)', minWidth: '600px' }}>
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

// ================= ATTENDANCE =================
function Attendance({ attendanceStatus, setAttendanceStatus, attendanceHistory, setAttendanceHistory }) {
  const currentDate = new Date().toLocaleDateString();

  const handlePunchIn = () => {
    setAttendanceStatus({
      ...attendanceStatus,
      isPresent: true,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      logoutTime: null,
    });
  };

  const handlePunchOut = () => {
    const logoutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendanceStatus({
      ...attendanceStatus,
      isPresent: false,
      logoutTime: logoutTime,
    });
    setAttendanceHistory([
      {
        id: generateId(),
        date: currentDate,
        loginTime: attendanceStatus.loginTime,
        logoutTime: logoutTime,
        status: "Present",
        hours: "8 hrs"
      },
      ...attendanceHistory
    ]);
  };

  return (
    <div className="container">
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0 }}>Mark Attendance</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ fontSize: '18px' }}>
            Status: <strong className={attendanceStatus.isPresent ? "tag green" : "tag red"} style={{ fontSize: '14px', marginLeft: '10px' }}>{attendanceStatus.isPresent ? "Present" : "Absent"}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '10px 15px', borderRadius: '8px' }}>Login Time: <strong>{attendanceStatus.loginTime || "--:--"}</strong></div>
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '10px 15px', borderRadius: '8px' }}>Working Hours: <strong>{attendanceStatus.isPresent ? "In Progress..." : (attendanceStatus.logoutTime ? "8 hrs" : "--:--")}</strong></div>
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button className="addBtn" style={{ marginTop: 0, width: '150px', background: attendanceStatus.isPresent ? '#555' : '#00c853' }} onClick={handlePunchIn} disabled={attendanceStatus.isPresent}>Punch In</button>
          <button className="addBtn" style={{ marginTop: 0, width: '150px', background: !attendanceStatus.isPresent ? '#555' : '#d50000' }} onClick={handlePunchOut} disabled={!attendanceStatus.isPresent}>Punch Out</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0 }}>Attendance History</h3>
        <div className="tableWrapper">
          <div className="row headerRow attendanceTable" style={{ gridTemplateColumns: 'repeat(5, 1fr)', minWidth: '600px' }}>
            <div>Date</div><div>Login Time</div><div>Logout Time</div><div>Total Hours</div><div>Status</div>
          </div>
          {attendanceHistory.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5 }}>No attendance records</p> :
            attendanceHistory.map(record => (
              <div className="row" key={record.id} style={{ gridTemplateColumns: 'repeat(5, 1fr)', minWidth: '600px' }}>
                <div>{record.date}</div>
                <div>{record.loginTime}</div>
                <div>{record.logoutTime}</div>
                <div>{record.hours}</div>
                <div><span className="tag green">{record.status}</span></div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ================= WORK DIARY =================
function WorkDiary({ workDiaryUrl, setWorkDiaryUrl, workDiaries, setWorkDiaries }) {
  const currentDate = new Date().toLocaleDateString();

  const handleSaveDiary = () => {
    if (workDiaryUrl) {
      setWorkDiaries([{ id: generateId(), url: workDiaryUrl, date: currentDate }, ...workDiaries]);
      setWorkDiaryUrl("");
      alert("Diary Link Saved!");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0 }}>Submit Work Diary</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input
            placeholder="Work Diary URL (Google Doc, Notion, etc.)"
            value={workDiaryUrl}
            onChange={(e) => setWorkDiaryUrl(e.target.value)}
            style={{ flex: 1, marginTop: 0, minWidth: '250px' }}
          />
          <button className="addBtn" style={{ marginTop: 0, width: 'auto' }} onClick={handleSaveDiary}>Save</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0 }}>Recent Saved Diaries</h3>
        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: '1fr 2fr 1fr', minWidth: '500px' }}>
            <div>Date</div><div>Diary Link</div><div>Actions</div>
          </div>
          {workDiaries.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5 }}>No diaries saved</p> :
            workDiaries.map(diary => (
              <div className="row" key={diary.id} style={{ gridTemplateColumns: '1fr 2fr 1fr', minWidth: '500px' }}>
                <div>{diary.date}</div>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px', margin: 'auto' }}>
                  <a href={diary.url} target="_blank" rel="noreferrer" style={{ color: '#2962ff' }}>{diary.url}</a>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button style={{ padding: '5px 10px', fontSize: '12px', background: '#2962ff', color: 'white' }} onClick={() => window.open(diary.url, '_blank')}>View</button>
                  <button style={{ padding: '5px 10px', fontSize: '12px', background: '#555', color: 'white' }} onClick={() => { navigator.clipboard.writeText(diary.url); alert("Copied!"); }}>Copy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}