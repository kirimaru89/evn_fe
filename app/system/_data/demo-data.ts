export const kpis = [
  {
    label: "Giá trị hợp đồng",
    value: "$8.42M",
    helper: "Pipeline gia hạn",
    delta: "+14.2%",
    tone: "positive",
  },
  {
    label: "Yêu cầu đang mở",
    value: "312",
    helper: "Trên 8 không gian làm việc",
    delta: "+28",
    tone: "neutral",
  },
  {
    label: "Tuân thủ SLA",
    value: "98.7%",
    helper: "30 ngày gần nhất",
    delta: "+2.1%",
    tone: "positive",
  },
  {
    label: "Ngoại lệ rủi ro",
    value: "17",
    helper: "Cần rà soát",
    delta: "-9.8%",
    tone: "negative",
  },
] as const

export const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
] as const

export const statusMatrix = [
  "active",
  "pending",
  "warning",
  "error",
  "success",
  "neutral",
  "inactive",
] as const

export const requests = [
  {
    id: "REQ-1048",
    account: "Vega Vận hành",
    type: "Rà soát truy cập",
    owner: "Mai Nguyen",
    priority: "Cao",
    status: "Đang rà soát",
    due: "Hôm nay",
  },
  {
    id: "REQ-1049",
    account: "Taupe Systems",
    type: "Ngoại lệ thanh toán",
    owner: "Daniel Park",
    priority: "Trung bình",
    status: "Đã phê duyệt",
    due: "Ngày mai",
  },
  {
    id: "REQ-1050",
    account: "Atlas Grid",
    type: "Xác nhận bảo mật",
    owner: "Linh Tran",
    priority: "Nghiêm trọng",
    status: "Bị chặn",
    due: "07/05",
  },
  {
    id: "REQ-1051",
    account: "Northwind Energy",
    type: "Tiếp nhận mua sắm",
    owner: "Sarah Kim",
    priority: "Thấp",
    status: "Bản nháp",
    due: "12/05",
  },
  {
    id: "REQ-1052",
    account: "Blue Ridge Capital",
    type: "Onboarding nhà cung cấp",
    owner: "Minh Pham",
    priority: "Trung bình",
    status: "Đang rà soát",
    due: "14/05",
  },
] as const

export const badgeVariantByStatus = {
  "Đã phê duyệt": "default",
  "Đang rà soát": "secondary",
  "Bị chặn": "destructive",
  "Bản nháp": "outline",
} as const

export const activity = [
  {
    title: "Hoàn tất phê duyệt tài chính",
    detail: "REQ-1049 đã được Daniel Park chuyển sang đã phê duyệt",
    meta: "12 phút trước",
  },
  {
    title: "Đã đánh dấu ngoại lệ bảo mật",
    detail: "Bảng câu hỏi nhà cung cấp nghiêm trọng cần rà soát",
    meta: "38 phút trước",
  },
  {
    title: "Đồng bộ không gian làm việc hoàn tất",
    detail: "8.420 bản ghi đã đối soát với hệ thống nguồn",
    meta: "1 giờ trước",
  },
] as const

export const patternKpis = [
  {
    title: "Chi tiêu được quản lý",
    value: "$12.8M",
    description: "Trong kiểm soát đang hoạt động",
    trend: "+8.6%",
    tone: "positive",
  },
  {
    title: "Độ phủ chính sách",
    value: "94.2%",
    description: "Đã ánh xạ với kiểm soát",
    trend: "+3.1%",
    tone: "positive",
  },
  {
    title: "Rà soát đang chờ",
    value: "68",
    description: "Cần chủ sở hữu xử lý",
    trend: "12 khẩn cấp",
    tone: "warning",
  },
] as const

export const patternRows = [
  {
    id: "CTRL-2401",
    title: "Rà soát nhà cung cấp hằng quý",
    description: "Xác thực kiểm soát tài chính và bảo mật",
    owner: "Vận hành",
    category: "Quản trị",
    status: "active",
    statusLabel: "Đang hoạt động",
    meta: "Hạn 10/05",
    actionLabel: "Mở",
    actionVariant: "outline",
  },
  {
    id: "CTRL-2402",
    title: "Xác nhận truy cập đặc quyền",
    description: "Cần chủ sở hữu bảo mật xác nhận",
    owner: "Bảo mật",
    category: "Truy cập",
    status: "warning",
    statusLabel: "Cảnh báo",
    meta: "3 điểm chặn",
    actionLabel: "Rà soát",
    actionVariant: "outline",
  },
  {
    id: "CTRL-2403",
    title: "Hàng đợi ngoại lệ hóa đơn",
    description: "Độ tin cậy khớp tự động dưới ngưỡng",
    owner: "Tài chính",
    category: "Thanh toán",
    status: "pending",
    statusLabel: "Đang chờ",
    meta: "18 bản ghi",
    actionLabel: "Gán",
    actionVariant: "outline",
  },
  {
    id: "CTRL-2404",
    title: "Đồng bộ dữ liệu khu vực",
    description: "Tất cả hệ thống nguồn đã được đối soát",
    owner: "Nền tảng",
    category: "Dữ liệu",
    status: "success",
    statusLabel: "Hoàn tất",
    meta: "99.98%",
    actionLabel: "Chi tiết",
    actionVariant: "ghost",
  },
  {
    id: "CTRL-2405",
    title: "Rà soát chính sách đã lưu trữ",
    description: "Đã được thay thế bởi khung kiểm soát hiện tại",
    owner: "Quản trị",
    category: "Chính sách",
    status: "inactive",
    statusLabel: "Không hoạt động",
    meta: "Đã lưu trữ",
    actionLabel: "Xem",
    actionVariant: "ghost",
  },
] as const

export type PatternRow = (typeof patternRows)[number]
