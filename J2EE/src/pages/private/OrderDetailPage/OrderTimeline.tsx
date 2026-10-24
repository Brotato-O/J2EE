function OrderTimeline(){
    return (<div className="detail-card timeline-card">
          <h2 className="card-title">Trạng thái đơn hàng</h2>
          <div className="stepper-wrapper">
            <div className="stepper-item completed">
              <div className="step-counter">✓</div>
              <div className="step-name">Đã đặt hàng</div>
              <div className="step-time">10:30 - 12/09/2026</div>
            </div>
            <div className="stepper-item completed">
              <div className="step-counter">✓</div>
              <div className="step-name">Đã xác nhận</div>
              <div className="step-time">11:15 - 12/09/2026</div>
            </div>
            <div className="stepper-item active">
              <div className="step-counter">🚚</div>
              <div className="step-name">Đang giao hàng</div>
              <div className="step-time">Dự kiến 14/09/2026</div>
            </div>
            <div className="stepper-item">
              <div className="step-counter">4</div>
              <div className="step-name">Đã giao hàng</div>
              <div className="step-time">--:--</div>
            </div>
          </div>
        </div>);

}

export default OrderTimeline;