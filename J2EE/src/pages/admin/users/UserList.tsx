interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

export default function UserList() {
    const users: User[] = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            email: "a@gmail.com",
            role: "USER",
            status: "ACTIVE",
        },
        {
            id: 2,
            name: "Trần Văn B",
            email: "b@gmail.com",
            role: "ADMIN",
            status: "ACTIVE",
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <h1>Quản lý người dùng</h1>
            </div>

            {/* Table */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>

                                <td>
                                    <strong>{user.name}</strong>
                                </td>

                                <td>{user.email}</td>

                                <td>
                                    <span
                                        className={
                                            user.role === "ADMIN"
                                                ? "user-role admin"
                                                : "user-role"
                                        }
                                    >
                                        {user.role}
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={
                                            user.status === "ACTIVE"
                                                ? "user-status active"
                                                : "user-status locked"
                                        }
                                    >
                                        {user.status}
                                    </span>
                                </td>

                                <td>
                                    <button className="btn-view">
                                        Xem
                                    </button>

                                    <button className="btn-delete">
                                        Khóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}