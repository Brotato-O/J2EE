export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>

            <p>Chào mừng bạn đến trang quản trị.</p>

            <div className="dashboard-cards">

                <div>
                    <h3>Sản phẩm</h3>
                    <p>120</p>
                </div>

                <div>
                    <h3>Người dùng</h3>
                    <p>350</p>
                </div>

                <div>
                    <h3>Đơn hàng</h3>
                    <p>86</p>
                </div>

            </div>
        </div>
    );
}