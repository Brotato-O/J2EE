interface OrderStatusFilterProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

function OrderStatusFilter({
    activeTab,
    setActiveTab,
}: OrderStatusFilterProps) {

    return (<div className="status-tabs">
        <button
            className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
        >
            Tất cả đơn
        </button>
        <button
            className={`tab-item ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
        >
            Đang giao
        </button>
        <button
            className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
        >
            Hoàn thành
        </button>
        <button
            className={`tab-item ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
        >
            Đã hủy
        </button>
    </div>)
}

export default OrderStatusFilter;