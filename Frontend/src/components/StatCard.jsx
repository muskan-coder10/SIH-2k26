
export default function StatCard({icon:Icon,title,value,note,accent='green'}) {
  return <div className={`stat-card ${accent}`}>
    <div className="stat-icon"><Icon size={22}/></div>
    <div><p>{title}</p><strong>{value}</strong><span>{note}</span></div>
  </div>
}
