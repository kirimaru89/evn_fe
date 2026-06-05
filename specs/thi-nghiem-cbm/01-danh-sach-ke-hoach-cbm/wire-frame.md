# 01-plan-list-full.md

## Source

SRS Section:
- 2.1 Xem danh sách / Tìm kiếm kế hoạch CBM
- 2.1.2 UI
- 2.1.3 Filter Components / Search Criteria
- 2.1.4 Data Table Columns
- 2.1.5 Action Components
- 2.1.7 Feedback & State Components

---

## ASCII Wireframe

```text
+----------------------------------------------------------------------------------------------------------------------+
| ☰  | MSM Portal / Thí nghiệm CBM / Theo dõi kế hoạch CBM                  [Tìm kiếm hệ thống...] [?] [User]        |
+----+-----------------------------------------------------------------------------------------------------------------+
|    |                                                                                                                 |
| SB | PAGE HEADER                                                                                                     |
|    | Theo dõi kế hoạch CBM                                                                                           |
|    | Theo dõi, tìm kiếm và xử lý workflow kế hoạch CBM                         Hiển thị 1-50 trên 236  [<] [>]      |
|    |                                                                                              [Import] [PMIS] [+ Tạo mới] |
|----+-----------------------------------------------------------------------------------------------------------------|
|    | FILTER PANEL                                                                                                   |
|    | [🔍 Tìm mã thiết bị / tên thiết bị / số seri...................................................]              |
|    |                                                                                                                 |
|    | [Ngày thực hiện ▼] [Trạng thái ▼] [Đơn vị quản lý ▼] [Vị trí ▼]                                  [Đặt lại]    |
|----+-----------------------------------------------------------------------------------------------------------------|
|    | BULK ACTION BAR (Visible When Selected > 0)                                                                     |
|    | Đã chọn: n kế hoạch                                                               [Xóa nhiều kế hoạch]         |
|----+-----------------------------------------------------------------------------------------------------------------|
|    | DATA TABLE                                                                                                      |
|    | [ ] | Mã thiết bị | Tên thiết bị | Vị trí | Đơn vị quản lý | Ngày TH | Trạng thái | Nguồn tạo | Cập nhật | ... |
|    |---------------------------------------------------------------------------------------------------------------  |
|    | [ ] | MBA001 | Máy biến áp T1 | Trạm 110kV HN | EVNHN  | 15/06 | Nháp      | Tạo mới | 10/06 09:30 | ... |
|    | [ ] | MBA002 | Máy biến áp T2 | Trạm 110kV ĐA | EVNHN  | 16/06 | Chờ duyệt | Import  | 10/06 10:15 | ... |
|    | [ ] | MBA003 | Máy biến áp T3 | Trạm 110kV GL | EVNBAC | 17/06 | Đã duyệt  | PMIS    | 11/06 08:45 | ... |
|----+-----------------------------------------------------------------------------------------------------------------|
+----+-----------------------------------------------------------------------------------------------------------------+
```

---

## Display Fields

### Page Header

| Field | Type |
|---------|---------|
| Page Title | Text |
| Page Description | Text |
| Total Records | Text |
| Current Range | Text |

### Filter Fields

| Field | Type |
|---------|---------|
| Tìm kiếm kế hoạch | Search Input |
| Ngày thực hiện | Date Range Picker |
| Trạng thái kế hoạch | Dropdown |
| Đơn vị quản lý | Dropdown |
| Vị trí | Dropdown |
| Đặt lại | Button |

### Data Table Columns

| Column | Type |
|---------|---------|
| Checkbox Selection | Checkbox |
| Mã thiết bị | Link |
| Tên thiết bị | Text |
| Vị trí | Text |
| Đơn vị quản lý | Text |
| Ngày thực hiện | Date |
| Trạng thái kế hoạch | Status Badge |
| Nguồn tạo kế hoạch | Badge/Text |
| Thời gian cập nhật | DateTime |
| Actions | Action Menu |

### Table Utilities

| Field | Type |
|---------|---------|
| Tùy chỉnh cột hiển thị | Dropdown / Modal |
| Pagination | Pagination |

---

## Filter / Search / Sort

### Search

- Mã thiết bị
- Tên thiết bị
- Số seri thiết bị

### Filter

| Field | Default |
|---------|---------|
| Ngày thực hiện | Tháng hiện tại |
| Trạng thái kế hoạch | Tất cả |
| Đơn vị quản lý | Tất cả |
| Vị trí | Tất cả |

### Date Presets

- Hôm nay
- 7 ngày qua
- 30 ngày qua
- Năm nay
- Năm trước
- Khoảng ngày tùy chỉnh

### Sort

Không đề cập trong SRS.

---

## Status Labels

- Nháp
- Chờ GĐXN duyệt
- Đã duyệt
- Từ chối
- Đã chuyển sang thực hiện

---

## Actions

### Page Actions

- Tạo mới kế hoạch
- Import Excel
- Đồng bộ PMIS
- Export danh sách kế hoạch
- Tùy chỉnh cột hiển thị
- Đặt lại filter

### Row Actions

- Xem chi tiết kế hoạch
- Chỉnh sửa kế hoạch
- Xóa kế hoạch
- Chuyển sang thực hiện CBM

### Bulk Actions

- Chọn nhiều kế hoạch
- Xóa nhiều kế hoạch

### Confirmation Dialogs

- Confirm xóa kế hoạch
- Confirm xóa nhiều kế hoạch

---

## States

### Default

- Table default state

### Loading

- Loading table data
- Searching
- Filtering
- Pagination changed

### Empty

- Empty result

### Validation

- Invalid date filter

### Selection

- Multi-selection active

### Action Availability

- Row action unavailable
- Bulk action unavailable

### Column Configuration

- Customize columns applied

### Delete States

- Delete confirmation
- Delete success
- Delete failed

### Update States

- Update popup opened
- Update success
- Update failed

---

## Mock Data Edge Cases

### Dataset

- 0 records
- 1 record
- 50 records
- 200+ records
- Multiple pages

### Search

- Search theo mã thiết bị
- Search theo tên thiết bị
- Search theo số seri
- Không có kết quả

### Long Content

- Mã thiết bị rất dài
- Tên thiết bị rất dài
- Đơn vị quản lý rất dài
- Vị trí rất dài

### Status Coverage

- Nháp
- Chờ GĐXN duyệt
- Đã duyệt
- Từ chối
- Đã chuyển sang thực hiện

### Source Coverage

- Tạo mới
- Import Excel
- Đồng bộ PMIS

### Selection Cases

- Chọn 1 dòng
- Chọn nhiều dòng
- Chọn nhiều dòng khác trạng thái

### Error Cases

- Delete failed
- Update failed
- Invalid date filter
- API timeout
- Empty response
