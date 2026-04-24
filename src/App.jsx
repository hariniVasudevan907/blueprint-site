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

  const [transactions, setTransactions] = useState([]);

  // NOTE: Revenue state is kept but unused as per requirement
  // const [revenue, setRevenue] = useState([]);

  // Employee focused states
  const [attendanceStatus, setAttendanceStatus] = useState({ isPresent: false, loginTime: null, logoutTime: null });
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [workDiaryUrl, setWorkDiaryUrl] = useState("");
  const [workDiaries, setWorkDiaries] = useState([]);
  const [finance, setFinance] = useState([]);

  return isLoggedIn ? (
    <div className={dark ? "app dark" : "app light"}>
      <style>{`
      *{box-sizing:border-box}
      body{margin:0;font-family:Arial}

      .app{min-height:100vh;width:100vw; overflow-x: hidden}

      .dark{background:linear-gradient(135deg,#0f0f0f,#1a1a1a);color:white}
      .light{background:#f5f5f5;color:black}

      /* ── Topbar ── */
      .topbar{
        display:flex; justify-content:space-between; align-items:center;
        padding:14px 30px;
        background:rgba(0,0,0,0.7);
        backdrop-filter:blur(12px);
        border-bottom:1px solid rgba(255,255,255,0.08);
        position:sticky; top:0; z-index:100;
      }
      .logo{
        font-size:22px; font-weight:800; color:red;
        letter-spacing:1.5px; text-shadow:0 0 10px rgba(255,0,0,0.45);
        flex-shrink:0;
      }

      /* Nav pill group */
      .navPillGroup{
        display:flex; gap:6px; align-items:center;
        background:rgba(255,255,255,0.04);
        padding:6px 8px; border-radius:999px;
        overflow-x:auto; scrollbar-width:none;
      }
      .navPillGroup::-webkit-scrollbar{display:none}

      /* Individual pill button */
      .navBtn{
        padding:7px 15px; border-radius:999px;
        background:transparent; color:#bbb;
        border:1px solid transparent;
        font-size:13px; font-weight:500;
        cursor:pointer; transition:all 0.25s ease;
        white-space:nowrap; flex-shrink:0;
      }
      .navBtn:hover{
        background:rgba(255,255,255,0.09); color:white;
        transform:scale(1.04); border-color:transparent;
      }
      .navBtn.active{
        background:linear-gradient(45deg,red,orange);
        color:white; border:none;
        box-shadow:0 3px 12px rgba(255,60,0,0.4);
      }
      .navBtn:disabled{ opacity:0.5; cursor:not-allowed; transform:none; }

      /* Right-side actions */
      .navActions{ display:flex; align-items:center; gap:10px; flex-shrink:0; }
      .themeBtn{
        padding:7px 14px; border-radius:999px;
        background:rgba(255,255,255,0.07);
        color:inherit; border:1px solid rgba(255,255,255,0.12);
        font-size:13px; cursor:pointer; transition:0.25s;
      }
      .themeBtn:hover{ background:rgba(255,255,255,0.14); color:white; transform:none; }
      .avatar{
        width:36px; height:36px; border-radius:50%; flex-shrink:0;
        background:linear-gradient(45deg,red,orange);
        display:flex; align-items:center; justify-content:center;
        font-size:14px; font-weight:800; color:white;
        box-shadow:0 2px 10px rgba(255,60,0,0.4);
      }

      button{padding:10px 18px;border-radius:10px;border:none;cursor:pointer;transition:.3s}
      button:hover{background:red;color:white;transform:translateY(-2px)}
      button:disabled{opacity: 0.5; cursor: not-allowed; transform: none;}

      .container{padding:40px;width:100%}

      .card{
        padding:30px;
        border-radius:20px;
        margin-bottom:30px;
        backdrop-filter:blur(10px);
        transition: 0.3s;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
      }

      .dark .card{background:rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05)}
      .light .card{background:white; box-shadow: 0 8px 30px rgba(0,0,0,0.12)}

      input,select{
        width:100%;padding:14px;margin-top:10px;border-radius:12px;border:1px solid #444;
        background:rgba(0,0,0,0.2);color:inherit;transition:.3s
      }

      input:focus,select:focus{
        outline:none;border-color:red;transform:scale(1.03);
        background:rgba(255,0,0,0.05);
      }

      .formGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}

      .addBtn{
        margin-top:20px;
        width:220px;
        padding:12px;
        border-radius:12px;
        background:linear-gradient(45deg,red,orange);
        color:white;
        font-weight:bold;
        border:none;
        cursor:pointer;
        transition:0.3s;
      }
      .addBtn:hover{
        transform:translateY(-2px);
        box-shadow:0 6px 20px rgba(255,0,0,0.4);
      }

      .row{
        display:grid;
        padding:14px;
        text-align:center;
        border-radius:12px;
        margin-top:8px;
        align-items:center;
        transition:0.2s;
      }

      .headerRow{
        font-weight:bold;
        background:linear-gradient(45deg,#8b0000,#b22222);
        border-radius:12px;
        color:white;
      }
      .row:hover{background:rgba(255,255,255,0.08)}

      .searchBar{display:flex;gap:10px;margin-bottom:20px}

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
        .navPillGroup{max-width:calc(100vw - 180px);}
        .topbar{padding:12px 16px;}
        .logo{font-size:18px;}
        .card{padding:15px;}
        .dashboardGrid { grid-template-columns:1fr; }
        .statRow { flex-wrap:wrap; }
        .statBox { min-width:80px; }
      }

      @media(max-width:600px){
        .leadStatsGrid { grid-template-columns:repeat(2,1fr); }
        .container { padding:16px; }
      }
      `}</style>

      <div className="topbar">
        {/* Logo */}
        <div className="logo">RoomAdda</div>

        {/* Pill nav group */}
        <div className="navPillGroup">
          {[
            { label: 'Dashboard',  key: 'dashboard'  },
            { label: 'Customers',  key: 'customers'  },
            { label: 'Leads',      key: 'leads'      },
            { label: 'Revenue',    key: 'revenue'    },
            { label: 'Properties', key: 'properties' },
            { label: 'Finance',    key: 'finance'    },
            { label: 'Employees',  key: 'employees'  },
            { label: 'Attendance', key: 'attendance' },
          ].map(({ label, key }) => (
            <button
              key={key}
              className={`navBtn${view === key ? ' active' : ''}`}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="navActions">
          <button className="themeBtn" onClick={() => setDark(!dark)}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div className="avatar">DP</div>
        </div>
      </div>

      {view === "dashboard" && <Dashboard
        attendanceStatus={attendanceStatus} setAttendanceStatus={setAttendanceStatus}
        attendanceHistory={attendanceHistory} setAttendanceHistory={setAttendanceHistory}
        workDiaryUrl={workDiaryUrl} setWorkDiaryUrl={setWorkDiaryUrl}
        workDiaries={workDiaries} setWorkDiaries={setWorkDiaries}
      />}
      {view === "customers" && <Customers customers={customers} setCustomers={setCustomers} />}
      {view === "leads" && <Leads leads={leads} setLeads={setLeads} />}
      {view === "properties" && <Properties properties={properties} setProperties={setProperties} customers={customers} />}
      {view === "employees" && <Employees employees={employees} setEmployees={setEmployees} />}
      {view === "attendance" && <Attendance
        attendanceStatus={attendanceStatus} setAttendanceStatus={setAttendanceStatus}
        attendanceHistory={attendanceHistory} setAttendanceHistory={setAttendanceHistory}
      />}
      {view === "revenue" && <Revenue transactions={transactions} setTransactions={setTransactions} />}
      {view === "finance" && <Finance finance={finance} setFinance={setFinance} properties={properties} />}
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
function Customers({ customers, setCustomers }) {
  const [search, setSearch] = useState('');

  const GOOGLE_FORM_URL = 'https://forms.gle/your-form-link-here'; // Replace with real URL

  const displayed = customers
    .slice(-50)
    .reverse()
    .filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
    );

  const visitBadge = (visit) => {
    if (visit === 'Visited') return 'green';
    if (visit === 'Not Interested') return 'red';
    return 'yellow'; // Pending default
  };

  return (
    <div className="container">
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0, textAlign: 'center' }}>Customer List</h3>

        {/* Search + Google Form button row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            placeholder="Search by name or phone"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, marginTop: 0, minWidth: '200px' }}
          />
          <button
            onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
            style={{
              background: 'linear-gradient(45deg,red,orange)',
              color: 'white', fontWeight: 'bold',
              padding: '10px 18px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            📋 Open Google Form
          </button>
        </div>

        {/* Table */}
        <div className="tableWrapper">
          <table className="attendanceTable" style={{ minWidth: '750px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Property</th>
                <th>Employee</th>
                <th>Visit Status</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>No customers found</td>
                </tr>
              ) : (
                displayed.map(c => (
                  <tr key={c.id}>
                    <td style={{ opacity: 0.5, fontSize: '11px' }}>#{String(c.id).slice(-5)}</td>
                    <td style={{ fontWeight: '600' }}>{c.name || 'N/A'}</td>
                    <td>{c.phone || 'N/A'}</td>
                    <td>{c.propertyId || '—'}</td>
                    <td>{c.employeeId || 'Unassigned'}</td>
                    <td>
                      <span className={`tag ${visitBadge(c.visit)}`}>
                        {c.visit || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ================= LEADS =================
function Leads({ leads, setLeads }) {
  const [form, setForm] = useState({ name: '', phone: '', source: 'Instagram', status: 'New' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const handleAdd = () => {
    if (!form.name || !form.phone) { alert('Name and phone are required.'); return; }
    setLeads([{ id: generateId(), ...form }, ...leads]);
    setForm({ name: '', phone: '', source: 'Instagram', status: 'New' });
  };

  const statusBadge = (status) => {
    if (status === 'Contacted') return 'blue';
    if (status === 'Converted') return 'green';
    return 'yellow'; // New default
  };

  const filtered = leads
    .filter(l => {
      const matchSearch =
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.phone?.includes(search);
      const matchFilter = filter === 'All' || l.status === filter;
      return matchSearch && matchFilter;
    });

  return (
    <div className="container">

      {/* Add Lead Form */}
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0, textAlign: 'center' }}>Add Lead</h3>
        <div className="formGrid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ marginTop: 0 }}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            style={{ marginTop: 0 }}
          />
          <select
            value={form.source}
            onChange={e => setForm({ ...form, source: e.target.value })}
            style={{ marginTop: 0 }}
          >
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Referral</option>
          </select>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ marginTop: 0 }}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Converted</option>
          </select>
        </div>
        <button className="addBtn" onClick={handleAdd} style={{ marginTop: '16px' }}>
          + Add Lead
        </button>
      </div>

      {/* Leads List */}
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0, textAlign: 'center' }}>Leads List</h3>

        {/* Search + Filter row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            placeholder="Search by name or phone"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, marginTop: 0, minWidth: '180px' }}
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ marginTop: 0, width: '160px', flexShrink: 0 }}
          >
            <option>All</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Converted</option>
          </select>
        </div>

        {/* Table */}
        <div className="tableWrapper">
          <table className="attendanceTable" style={{ minWidth: '600px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>No leads found</td>
                </tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id}>
                    <td style={{ opacity: 0.5, fontSize: '11px' }}>#{String(l.id).slice(-5)}</td>
                    <td style={{ fontWeight: '600' }}>{l.name}</td>
                    <td>{l.phone}</td>
                    <td>{l.source}</td>
                    <td>
                      <span className={`tag ${statusBadge(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
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

// ================= REVENUE =================
function Revenue({ transactions, setTransactions }) {
  const [form, setForm] = useState({
    name: '', amount: '', mode: 'Cash', status: 'Paid',
    date: new Date().toISOString().slice(0, 10),
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const handleAdd = () => {
    if (!form.name || !form.amount) { alert('Customer name and amount are required.'); return; }
    setTransactions([{ id: generateId(), ...form }, ...transactions]);
    setForm({ name: '', amount: '', mode: 'Cash', status: 'Paid', date: new Date().toISOString().slice(0, 10) });
  };

  const filtered = transactions.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.date.includes(search);
    const matchFilter = filter === 'All' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="container">

      {/* Add Transaction */}
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0, textAlign: 'center' }}>💰 Add Transaction</h3>
        <div className="formGrid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          <input
            placeholder="Customer Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ marginTop: 0 }}
          />
          <input
            placeholder="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            style={{ marginTop: 0 }}
          />
          <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} style={{ marginTop: 0 }}>
            <option>Cash</option>
            <option>UPI</option>
            <option>Bank Transfer</option>
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ marginTop: 0 }}>
            <option>Paid</option>
            <option>Pending</option>
          </select>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            style={{ marginTop: 0 }}
          />
        </div>
        <button className="addBtn" onClick={handleAdd} style={{ marginTop: '16px' }}>
          + Add Transaction
        </button>
      </div>

      {/* Revenue Records */}
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0, textAlign: 'center' }}>📋 Revenue Records</h3>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            placeholder="Search by name or date..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, marginTop: 0, minWidth: '180px' }}
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ marginTop: 0, width: '150px', flexShrink: 0 }}
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="tableWrapper">
          <table className="attendanceTable" style={{ minWidth: '700px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Amount (₹)</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id}>
                    <td style={{ opacity: 0.5, fontSize: '11px' }}>#{String(t.id).slice(-5)}</td>
                    <td style={{ fontWeight: '600' }}>{t.name}</td>
                    <td style={{ color: '#ff7b00', fontWeight: '700' }}>₹{Number(t.amount).toLocaleString('en-IN')}</td>
                    <td>{t.mode}</td>
                    <td>
                      <span className={`tag ${t.status === 'Paid' ? 'green' : 'yellow'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{t.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ================= FINANCE =================
function Finance({ finance, setFinance, properties }) {
  const emptyForm = {
    id: '', customer: '', propertyId: '', amount: '',
    type: 'Cash', status: 'Paid',
    date: new Date().toISOString().slice(0, 10),
  };
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    if (!form.id) { alert('Transaction ID is required.'); return; }
    if (!form.customer) { alert('Customer Name is required.'); return; }
    if (!form.amount || Number(form.amount) <= 0) { alert('Amount must be greater than 0.'); return; }
    if (finance.find(f => f.id === form.id)) { alert('Duplicate Transaction ID!'); return; }
    setFinance([...finance, { ...form, amount: Number(form.amount) }]);
    setForm(emptyForm);
  };

  const filtered = finance.filter(f =>
    f.id.includes(search) ||
    f.customer.toLowerCase().includes(search.toLowerCase())
  );

  // Summary calculations
  const total = finance.reduce((s, f) => s + f.amount, 0);
  const paid = finance.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0);
  const pending = finance.filter(f => f.status === 'Pending').reduce((s, f) => s + f.amount, 0);
  const fmt = n => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="container">

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Revenue', value: fmt(total), color: '#ff7b00' },
          { label: 'Paid Amount', value: fmt(paid), color: '#00c853' },
          { label: 'Pending Amount', value: fmt(pending), color: '#ffab00' },
        ].map(s => (
          <div key={s.label} className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Add Transaction ── */}
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0, textAlign: 'center' }}> Add Transaction</h3>
        <div className="formGrid">
          <input
            placeholder="Transaction ID"
            value={form.id}
            onChange={e => setForm({ ...form, id: e.target.value })}
          />
          <input
            placeholder="Customer Name"
            value={form.customer}
            onChange={e => setForm({ ...form, customer: e.target.value })}
          />
          {properties.length > 0 ? (
            <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })}>
              <option value="">-- Select Property --</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.id} – {p.location}</option>
              ))}
            </select>
          ) : (
            <input
              placeholder="Property ID"
              value={form.propertyId}
              onChange={e => setForm({ ...form, propertyId: e.target.value })}
            />
          )}
          <input
            placeholder="Amount (₹)"
            type="number"
            min="1"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option>Cash</option>
            <option>UPI</option>
            <option>Bank Transfer</option>
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option>Paid</option>
            <option>Pending</option>
          </select>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <button className="addBtn" onClick={handleAdd}>+ Add Transaction</button>
      </div>

      {/* ── Finance List ── */}
      <div className="card">
        <h3 style={{ color: 'red', marginTop: 0, textAlign: 'center' }}> Finance Records</h3>

        <div className="searchBar">
          <input
            placeholder="Search by Transaction ID or Customer Name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginTop: 0 }}
          />
        </div>

        <div className="tableWrapper">
          <div className="row headerRow" style={{ gridTemplateColumns: 'repeat(7,1fr)', minWidth: '900px' }}>
            <div>ID</div><div>Customer</div><div>Property</div>
            <div>Amount</div><div>Type</div><div>Status</div><div>Date</div>
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px 0' }}>No finance records found</p>
          ) : (
            filtered.map(f => (
              <div className="row" key={f.id} style={{ gridTemplateColumns: 'repeat(7,1fr)', minWidth: '900px' }}>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>{f.id}</div>
                <div style={{ fontWeight: '600' }}>{f.customer}</div>
                <div>{f.propertyId || '—'}</div>
                <div style={{ color: '#ff7b00', fontWeight: '700' }}>{fmt(f.amount)}</div>
                <div>{f.type}</div>
                <div>
                  <span className={`tag ${f.status === 'Paid' ? 'green' : 'yellow'}`}>
                    {f.status}
                  </span>
                </div>
                <div>{f.date}</div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}