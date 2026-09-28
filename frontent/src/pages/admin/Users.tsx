const Users = () => {
  const users = [
    { name: 'John Doe', role: 'Admin', status: 'Active' },
    { name: 'Sarah Lee', role: 'Manager', status: 'Active' },
    { name: 'Amit Singh', role: 'Developer', status: 'Pending' },
    { name: 'Nina Patel', role: 'Support', status: 'Inactive' },
  ]

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="section-header">
          <h1>User Management</h1>
          <button className="primary-btn small-btn">Add User</button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-pill ${user.status.toLowerCase()}`}>{user.status}</span>
                </td>
                <td>
                  <button className="link-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users;