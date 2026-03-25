import { useState, useEffect } from "react";
import { careersApi } from "../../api/adminApi";
import { FiBriefcase, FiClipboard, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

const departments = ["Front Desk","Housekeeping","Food & Beverage","Kitchen","Management","Maintenance","Sales & Marketing","Finance","Human Resources","Security","Other"];
const employmentTypes = ["Full-time","Part-time","Contract","Internship"];
const careerStatuses = ["active","closed","draft"];
const appStatuses = ["pending","reviewing","shortlisted","interviewed","rejected","accepted"];
const emptyCareer = { title:"",department:"Front Desk",location:"",employmentType:"Full-time",description:"",requirements:"",responsibilities:"",experienceRequired:"",applicationDeadline:"",status:"active",vacancies:1 };

function CareersManagement() {
  const [careers, setCareers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("careers");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({...emptyCareer});
  const [selectedApp, setSelectedApp] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    try {
      const [cRes, aRes] = await Promise.allSettled([careersApi.getAll(), careersApi.getApplications()]);
      const cd = cRes.status==="fulfilled" ? cRes.value.data.data : [];
      setCareers(Array.isArray(cd)?cd:cd?.docs||[]);
      const ad = aRes.status==="fulfilled" ? aRes.value.data.data : [];
      setApplications(Array.isArray(ad)?ad:ad?.docs||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(()=>{fetchData();},[]);

  const showMsg=(msg,type="success")=>{setAlert({msg,type});setTimeout(()=>setAlert(null),3000);};

  const openCreate=()=>{setForm({...emptyCareer});setEditId(null);setShowForm(true);};
  const openEdit=(c)=>{
    setForm({title:c.title||"",department:c.department||"Front Desk",location:c.location||"",employmentType:c.employmentType||"Full-time",description:c.description||"",requirements:c.requirements||"",responsibilities:c.responsibilities||"",experienceRequired:c.experienceRequired||"",applicationDeadline:c.applicationDeadline?c.applicationDeadline.split("T")[0]:"",status:c.status||"active",vacancies:c.vacancies||1});
    setEditId(c._id);setShowForm(true);
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const p={...form};if(!p.applicationDeadline)delete p.applicationDeadline;
    try{
      if(editId){await careersApi.update(editId,p);showMsg("Career updated");}
      else{await careersApi.create(p);showMsg("Career created");}
      setShowForm(false);fetchData();
    }catch(err){showMsg(err.response?.data?.message||"Failed","error");}
  };

  const handleDelete=async(id)=>{
    if(!window.confirm("Delete this career?"))return;
    try{await careersApi.delete(id);showMsg("Deleted");fetchData();}
    catch(err){showMsg(err.response?.data?.message||"Failed","error");}
  };

  const handleAppStatus=async(id,status)=>{
    try{await careersApi.updateApplicationStatus(id,{status});showMsg(`Status: ${status}`);fetchData();setSelectedApp(null);}
    catch(err){showMsg(err.response?.data?.message||"Failed","error");}
  };

  const handleDeleteApp=async(id)=>{
    if(!window.confirm("Delete application?"))return;
    try{await careersApi.deleteApplication(id);showMsg("Deleted");setSelectedApp(null);fetchData();}
    catch(err){showMsg(err.response?.data?.message||"Failed","error");}
  };

  if(loading)return <div className="admin-loading-screen" style={{height:"50vh",background:"transparent"}}><div className="admin-spinner"/></div>;

  return (
    <div>
      <h1 className="admin-page-title">Careers</h1>
      {alert&&<div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab==="careers"?"active":""}`} onClick={()=>setActiveTab("careers")}>Positions ({careers.length})</button>
        <button className={`admin-tab ${activeTab==="applications"?"active":""}`} onClick={()=>setActiveTab("applications")}>Applications ({applications.length})</button>
      </div>

      {activeTab==="careers"&&(
        <div className="admin-table-wrapper">
          <div className="admin-table-header"><h3>{careers.length} position(s)</h3><button className="admin-btn admin-btn-primary" onClick={openCreate}>+ New Position</button></div>
          <div className="table-overflow"><table className="admin-table"><thead><tr><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Vacancies</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{careers.length===0?<tr><td colSpan="7"><div className="admin-empty-state"><div className="empty-icon"><FiBriefcase /></div><p>No positions</p></div></td></tr>:
            careers.map(c=><tr key={c._id}><td style={{fontWeight:500}}>{c.title}</td><td>{c.department}</td><td>{c.location}</td><td>{c.employmentType}</td><td>{c.vacancies}</td><td><span className={`status-badge ${c.status}`}>{c.status}</span></td><td><div className="admin-actions"><button className="admin-btn-icon" onClick={()=>openEdit(c)} title="Edit"><FiEdit2 /></button><button className="admin-btn-icon" onClick={()=>handleDelete(c._id)} title="Delete"><FiTrash2 /></button></div></td></tr>)
          }</tbody></table></div>
        </div>
      )}

      {activeTab==="applications"&&(
        <div className="admin-table-wrapper">
          <div className="admin-table-header"><h3>{applications.length} application(s)</h3></div>
          <div className="table-overflow"><table className="admin-table"><thead><tr><th>Applicant</th><th>Email</th><th>Position</th><th>Availability</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{applications.length===0?<tr><td colSpan="7"><div className="admin-empty-state"><div className="empty-icon"><FiClipboard /></div><p>No applications</p></div></td></tr>:
            applications.map(a=><tr key={a._id}><td style={{fontWeight:500}}>{a.firstName} {a.lastName}</td><td>{a.email}</td><td>{a.career?.title||"—"}</td><td>{a.availability}</td><td><span className={`status-badge ${a.status}`}>{a.status}</span></td><td>{new Date(a.createdAt).toLocaleDateString()}</td><td><button className="admin-btn-icon" onClick={()=>setSelectedApp(a)} title="View"><FiEye /></button><button className="admin-btn-icon" onClick={()=>handleDeleteApp(a._id)} title="Delete"><FiTrash2 /></button></td></tr>)
          }</tbody></table></div>
        </div>
      )}

      {showForm&&(
        <div className="admin-modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="admin-modal wide" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header"><h3>{editId?"Edit":"Create"} Position</h3><button className="admin-modal-close" onClick={()=>setShowForm(false)}>×</button></div>
            <form onSubmit={handleSubmit}><div className="admin-modal-body">
              <div className="admin-form-group"><label>Job Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Department</label><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>{departments.map(d=><option key={d}>{d}</option>)}</select></div>
                <div className="admin-form-group"><label>Type</label><select value={form.employmentType} onChange={e=>setForm({...form,employmentType:e.target.value})}>{employmentTypes.map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Location</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required/></div>
                <div className="admin-form-group"><label>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{careerStatuses.map(s=><option key={s}>{s}</option>)}</select></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Vacancies</label><input type="number" min="1" value={form.vacancies} onChange={e=>setForm({...form,vacancies:parseInt(e.target.value)||1})}/></div>
                <div className="admin-form-group"><label>Deadline</label><input type="date" value={form.applicationDeadline} onChange={e=>setForm({...form,applicationDeadline:e.target.value})}/></div>
              </div>
              <div className="admin-form-group"><label>Experience</label><input value={form.experienceRequired} onChange={e=>setForm({...form,experienceRequired:e.target.value})} placeholder="e.g. 2+ years"/></div>
              <div className="admin-form-group"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
              <div className="admin-form-group"><label>Requirements</label><textarea value={form.requirements} onChange={e=>setForm({...form,requirements:e.target.value})} required/></div>
              <div className="admin-form-group"><label>Responsibilities</label><textarea value={form.responsibilities} onChange={e=>setForm({...form,responsibilities:e.target.value})}/></div>
            </div>
            <div className="admin-modal-footer"><button type="button" className="admin-btn admin-btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="admin-btn admin-btn-primary">{editId?"Update":"Create"}</button></div>
            </form></div></div>
      )}

      {selectedApp&&(
        <div className="admin-modal-overlay" onClick={()=>setSelectedApp(null)}>
          <div className="admin-modal wide" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header"><h3>Application Details</h3><button className="admin-modal-close" onClick={()=>setSelectedApp(null)}>×</button></div>
            <div className="admin-modal-body"><div className="admin-detail-grid">
              <div className="admin-detail-item"><div className="detail-label">Name</div><div className="detail-value">{selectedApp.firstName} {selectedApp.lastName}</div></div>
              <div className="admin-detail-item"><div className="detail-label">Email</div><div className="detail-value">{selectedApp.email}</div></div>
              <div className="admin-detail-item"><div className="detail-label">Phone</div><div className="detail-value">{selectedApp.phone}</div></div>
              <div className="admin-detail-item"><div className="detail-label">Country</div><div className="detail-value">{selectedApp.address?.country||"—"}</div></div>
              <div className="admin-detail-item"><div className="detail-label">Position</div><div className="detail-value">{selectedApp.career?.title||"—"}</div></div>
              <div className="admin-detail-item"><div className="detail-label">Availability</div><div className="detail-value">{selectedApp.availability}</div></div>
              <div className="admin-detail-item"><div className="detail-label">Education</div><div className="detail-value">{selectedApp.education}</div></div>
              <div className="admin-detail-item"><div className="detail-label">Experience</div><div className="detail-value">{selectedApp.experience}</div></div>
              {selectedApp.skills&&<div className="admin-detail-item admin-detail-full"><div className="detail-label">Skills</div><div className="detail-value">{selectedApp.skills}</div></div>}
              <div className="admin-detail-item admin-detail-full"><div className="detail-label">Cover Letter</div><div className="detail-value" style={{whiteSpace:"pre-wrap"}}>{selectedApp.coverLetter}</div></div>
              <div className="admin-detail-item"><div className="detail-label">Status</div><div className="detail-value"><span className={`status-badge ${selectedApp.status}`}>{selectedApp.status}</span></div></div>
              <div className="admin-detail-item"><div className="detail-label">Update Status</div><div className="detail-value"><select value={selectedApp.status} onChange={e=>handleAppStatus(selectedApp._id,e.target.value)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid #ddd"}}>{appStatuses.map(s=><option key={s}>{s}</option>)}</select></div></div>
            </div></div>
            <div className="admin-modal-footer"><button className="admin-btn admin-btn-danger admin-btn-sm" onClick={()=>handleDeleteApp(selectedApp._id)} style={{display:"flex", alignItems:"center", gap: "6px"}}><FiTrash2 /> Delete</button><button className="admin-btn admin-btn-secondary" onClick={()=>setSelectedApp(null)}>Close</button></div>
          </div></div>
      )}
    </div>
  );
}

export default CareersManagement;
