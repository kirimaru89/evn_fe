# API Contract: Danh sách kế hoạch CBM

## Metadata

| Field | Value |
| --- | --- |
| Module | Thí nghiệm CBM |
| Module slug | thi-nghiem-cbm |
| Feature ID | #8966 |
| Use Case ID | UC-PLAN-01 |
| Screen ID | TBD(BA) |
| Feature Spec | `.specs/thi-nghiem-cbm/01-danh-sach-ke-hoach-cbm/feature-spec.md` |
| Contract status | Draft |
| Needs BE confirmation | Yes |
| Source documents | MSM_CBM_SRS_v1.1.docx §2.1, §2.1.2, §2.1.3, §2.1.4, §2.1.5, §2.1.7, §2.1.8, §2.1.9 |

## Contract Scope

### In Scope

- Query danh sách kế hoạch CBM theo phạm vi quản lý được phép.
- Search theo mã thiết bị, tên thiết bị hoặc số seri thiết bị.
- Filter theo ngày thực hiện, trạng thái kế hoạch, đơn vị quản lý và vị trí.
- Phân trang danh sách với kích thước 50 bản ghi/trang theo source spec.
- Trả dữ liệu hiển thị bảng danh sách kế hoạch CBM.
- Trả metadata cần thiết để hiển thị tổng số bản ghi và range hiện tại.
- Hỗ trợ dữ liệu cho action availability theo trạng thái kế hoạch hoặc xác nhận FE tự derive theo workflow rules.
- Validate xóa kế hoạch theo trạng thái `Nháp`.
- Validate bulk action khi tất cả kế hoạch được chọn đều hợp lệ.
- Hỗ trợ chuyển kế hoạch trạng thái `Đã duyệt` sang thực hiện CBM nếu operation này thuộc phạm vi list screen.
- Cung cấp hoặc phối hợp nguồn dữ liệu filter đơn vị/vị trí từ PMIS.

### Out of Scope

- Contract chi tiết cho popup Tạo mới kế hoạch CBM thuộc PBI 02.
- Contract chi tiết cho Import Excel thuộc PBI 03.
- Contract chi tiết cho Đồng bộ PMIS thuộc PBI 04.
- Contract chi tiết cho Chi tiết kế hoạch và Cập nhật kế hoạch thuộc PBI 05.
- Backend domain model, persistence model, service design, DTO filenames, endpoint URL và HTTP method.

## API Capabilities

| Capability | Product Operation | Scope | Confirmation |
| --- | --- | --- | --- |
| List CBM plans | Trả danh sách kế hoạch CBM theo search/filter/pagination và phạm vi quyền | In scope | Draft |
| Get CBM plan filter options | Tải trước danh mục đơn vị quản lý và vị trí bằng API filter options riêng, nguồn PMIS | In scope | Draft |
| Delete CBM plan | Xóa một kế hoạch CBM khi trạng thái hợp lệ | In scope | Draft |
| Bulk delete CBM plans | Xóa nhiều kế hoạch CBM khi tất cả kế hoạch được chọn đều hợp lệ | In scope | Draft, needs BA/BE confirmation |
| Transfer CBM plan to execution | Chuyển kế hoạch trạng thái `Đã duyệt` sang thực hiện CBM | In scope | TBD(BA/BE) |
| Export CBM plan list | Export danh sách kế hoạch CBM theo danh sách hiện tại, filter hiện tại và cột đang hiển thị | In scope | Draft |

## Query Contracts

### List CBM Plans Query

Purpose: Trả danh sách kế hoạch CBM theo phạm vi quản lý được phép, search/filter hiện tại và phân trang.

| Param | Type | Required | Source Feature Field | Validation / Notes |
| --- | --- | --- | --- | --- |
| keyword | Text | No | Tìm kiếm kế hoạch | Search theo mã thiết bị, tên thiết bị hoặc số seri thiết bị. |
| executionDateFrom | Date string | No | Ngày thực hiện | Format `YYYY-MM-DD`, không timezone; áp dụng CR-DATE; mặc định tháng hiện tại theo Feature Spec. |
| executionDateTo | Date string | No | Ngày thực hiện | Format `YYYY-MM-DD`, không timezone; áp dụng CR-DATE; khoảng ngày không hợp lệ phải trả validation behavior rõ ràng. |
| status | Enum | No | Trạng thái kế hoạch | Giá trị filter: Nháp, Chờ GĐXN duyệt, Đã duyệt, Từ chối, Đã chuyển sang thực hiện. |
| managingUnitId | Text | No | Đơn vị quản lý | Lọc theo đơn vị quản lý từ PMIS; identifier thực tế là TBD(BE). |
| locationId | Text | No | Vị trí | Lọc theo vị trí từ PMIS; identifier thực tế là TBD(BE). |
| page | Number | No | Pagination | Page number dùng base 1. |
| pageSize | Number | No | Pagination | Mặc định 50 bản ghi/trang theo Feature Spec. |

### CBM Plan Filter Options Query

Purpose: Cung cấp dữ liệu cho filter đơn vị quản lý và vị trí trên màn danh sách.

| Param | Type | Required | Source Feature Field | Validation / Notes |
| --- | --- | --- | --- | --- |
| none | None | No | Đơn vị quản lý / Vị trí | Filter options được tải trước bằng API riêng; không trả cùng response danh sách và chưa hỗ trợ remote search trong task này. |

## Response Contracts

### List CBM Plans Response

| Field | Type | Required | Source Feature Field | Notes |
| --- | --- | --- | --- | --- |
| items | List | Yes | Data table | Danh sách kế hoạch CBM theo search/filter/pagination hiện tại. |
| items[].id | Text | Yes | Actions / Selection | Identifier kế hoạch để thực hiện row action, selection và mutation; tên field thực tế là TBD(BE). |
| items[].deviceCode | Text | Yes | Mã thiết bị | Hiển thị dạng link mở chi tiết. |
| items[].deviceName | Text | Yes | Tên thiết bị | Hiển thị bảng và hỗ trợ search. |
| items[].serialNumber | Text | Yes | Số seri thiết bị | API trả trong response danh sách; dùng cho search và có thể dùng cho hiển thị/đối chiếu khi cần. |
| items[].locationName | Text | Yes | Vị trí thiết bị | Hiển thị trong bảng. |
| items[].managingUnitName | Text | Yes | Đơn vị quản lý thiết bị | Hiển thị trong bảng. |
| items[].executionDate | Date string | Yes | Ngày thực hiện kế hoạch | Format API `YYYY-MM-DD`, không timezone; UI hiển thị `dd/MM/yyyy`. |
| items[].status | Enum | Yes | Trạng thái workflow | Trả một trong các trạng thái: Nháp, Chờ GĐXN duyệt, Đã duyệt, Từ chối, Đã chuyển sang thực hiện. |
| items[].source | Enum / Text | Yes | Nguồn tạo kế hoạch | Source coverage: Tạo mới, Import Excel, Đồng bộ PMIS. |
| items[].updatedAt | DateTime string | Yes | Thời gian cập nhật | ISO 8601 datetime có timezone, ví dụ `2026-06-10T09:30:00+07:00`; UI hiển thị `dd/MM/yyyy HH:mm`. |
| items[].availableActions | List | Yes | Actions | BE trả danh sách action hợp lệ cho từng kế hoạch; FE dùng danh sách này để hiển thị/enable row actions. |

### CBM Plan Filter Options Response

| Field | Type | Required | Source Feature Field | Notes |
| --- | --- | --- | --- | --- |
| managingUnits | List | TBD(BE) | Đơn vị quản lý | Danh mục đơn vị từ PMIS. |
| managingUnits[].id | Text | TBD(BE) | Đơn vị quản lý | Identifier dùng cho query `managingUnitId`. |
| managingUnits[].name | Text | TBD(BE) | Đơn vị quản lý | Label hiển thị trong filter. |
| locations | List | TBD(BE) | Vị trí | Danh mục vị trí từ PMIS. |
| locations[].id | Text | TBD(BE) | Vị trí | Identifier dùng cho query `locationId`. |
| locations[].name | Text | TBD(BE) | Vị trí | Label hiển thị trong filter. |

### Pagination / Metadata

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| total | Number | Yes | Tổng số bản ghi theo điều kiện search/filter hiện tại. |
| page | Number | Yes | Trang hiện tại, dùng base 1. |
| pageSize | Number | Yes | Kích thước trang, mặc định 50. |
| currentRange | Text | No | Có thể FE derive từ `page`, `pageSize`, `total`; API không bắt buộc trả nếu FE tự tính. |

### Assumed Status Contract

Status contract dưới đây là **tự suy từ status list do user cung cấp và workflow/action rules hiện có trong Feature Spec**. Đây là draft contract, chưa phải BE-confirmed enum.

| Status Value | Label | API Usage | Assumption |
| --- | --- | --- | --- |
| draft | Nháp | Query `status`, response `items[].status`, workflow validation | Cho phép cập nhật và xóa. |
| pendingDirectorApproval | Chờ GĐXN duyệt | Query `status`, response `items[].status`, workflow validation | Không cho cập nhật/xóa/chuyển trên màn danh sách. |
| approved | Đã duyệt | Query `status`, response `items[].status`, workflow validation | Cho phép chuyển sang thực hiện CBM. |
| rejected | Từ chối | Query `status`, response `items[].status`, workflow validation | Cho phép cập nhật. |
| transferredToExecution | Đã chuyển sang thực hiện | Query `status`, response `items[].status`, workflow validation | Assumed là trạng thái sau action `Chuyển sang thực hiện CBM`. |

## Mutation Contracts

### Delete CBM Plan

Purpose: Xóa một kế hoạch CBM khi kế hoạch ở trạng thái `Nháp`.

| Input | Type | Required | Source | Validation / Notes |
| --- | --- | --- | --- | --- |
| planId | Text | Yes | items[].id | Kế hoạch phải ở trạng thái `Nháp` theo BR-PLAN-LIST-04. |

Expected result:

- Xóa thành công kế hoạch được chọn.
- Danh sách reload theo điều kiện hiện tại.
- FE hiển thị thông báo thành công.

### Bulk Delete CBM Plans

Purpose: Xóa nhiều kế hoạch CBM khi tất cả kế hoạch được chọn đều thỏa điều kiện xóa.

| Input | Type | Required | Source | Validation / Notes |
| --- | --- | --- | --- | --- |
| planIds | List | Yes | Selected plans / items[].id | Tất cả kế hoạch được chọn phải ở trạng thái `Nháp`; nếu có ít nhất một kế hoạch không phải `Nháp` thì bulk delete không hợp lệ. |

Expected result:

- Xóa thành công các kế hoạch hợp lệ được chọn.
- Danh sách reload theo điều kiện hiện tại.
- FE hiển thị thông báo thành công.

### Transfer CBM Plan To Execution

Purpose: Chuyển kế hoạch trạng thái `Đã duyệt` sang thực hiện CBM.

| Input | Type | Required | Source | Validation / Notes |
| --- | --- | --- | --- | --- |
| planId | Text | Yes | items[].id | Chỉ kế hoạch trạng thái `Đã duyệt` được chuyển sang thực hiện CBM theo BR-PLAN-LIST-05. |

Expected result:

- Kế hoạch được chuyển sang thực hiện CBM theo workflow hợp lệ.
- Danh sách reload hoặc cập nhật dữ liệu theo trạng thái mới.

### Export CBM Plan List

Purpose: Export danh sách kế hoạch CBM.

| Input | Type | Required | Source | Validation / Notes |
| --- | --- | --- | --- | --- |
| filters | Object | Yes | Search / Filter Fields | Export theo filter hiện tại và danh sách hiện tại. |
| visibleColumns | List | Yes | Tùy chỉnh cột hiển thị | Export theo cột đang hiển thị. |

Expected result:

- Export danh sách kế hoạch theo danh sách hiện tại, filter hiện tại và cột đang hiển thị.

## Error Contract

| Error Case | Trigger | Expected API Behavior | Expected FE Behavior | Source |
| --- | --- | --- | --- | --- |
| Invalid date filter | `executionDateFrom`/`executionDateTo` không hợp lệ | Trả lỗi validation semantic; format/code TBD(BE) | Hiển thị lỗi validation cho filter ngày, không làm mất điều kiện đã nhập | Screen state `Invalid date filter`; CR-DATE |
| Forbidden scope | Người dùng truy vấn kế hoạch ngoài phạm vi quản lý được phép | Trả lỗi permission/scope semantic; format/code TBD(BE) | Hiển thị lỗi phù hợp, giữ nguyên dữ liệu hiện tại | BR-PLAN-LIST-01 |
| Empty result | Query hợp lệ nhưng không có dữ liệu phù hợp | Trả danh sách rỗng và metadata phù hợp | Hiển thị trạng thái empty result/no result | AC-PLAN-LIST-08 |
| Empty response | Response rỗng ngoài kỳ vọng contract | TBD(BE) | Hiển thị trạng thái lỗi hoặc empty phù hợp theo dữ liệu trả về | Validation / Error AC |
| Delete invalid status | Xóa kế hoạch không ở trạng thái `Nháp` | Trả lỗi validation/workflow semantic; format/code TBD(BE) | Không cho xóa hoặc hiển thị lỗi phù hợp, giữ nguyên dữ liệu hiện tại | BR-PLAN-LIST-04; AC-PLAN-LIST-10 |
| Bulk action invalid selection | Với bulk delete: tồn tại ít nhất một kế hoạch được chọn không ở trạng thái `Nháp` | Trả lỗi validation/workflow semantic; format/code TBD(BE) | FE disable hoặc ngăn bulk delete trước; nếu API vẫn trả lỗi thì hiển thị lỗi phù hợp | BR-PLAN-LIST-06 & 08; AC-PLAN-LIST-06 |
| Transfer invalid status | Chuyển kế hoạch không ở trạng thái `Đã duyệt` | Trả lỗi validation/workflow semantic; format/code TBD(BE) | Không cho chuyển hoặc hiển thị lỗi phù hợp | BR-PLAN-LIST-05 |
| Mutation failed | Delete, bulk delete hoặc transfer thất bại do hệ thống/tích hợp | Trả lỗi system/integration semantic; format/code TBD(BE) | Hiển thị lỗi phù hợp, giữ nguyên dữ liệu hiện tại | Delete failed / validation-error AC |
| API timeout | Query hoặc mutation timeout | TBD(BE) | Hiển thị lỗi phù hợp, giữ nguyên điều kiện hiện tại | Mock Data Edge Cases / Validation Error AC |

## Validation And Permission Contract

| Rule | API Responsibility | FE Responsibility | Source |
| --- | --- | --- | --- |
| Scope permission | Chỉ trả dữ liệu trong đơn vị/phạm vi quản lý được phép; reject truy cập ngoài phạm vi | Không hiển thị dữ liệu ngoài response; hiển thị lỗi nếu API trả permission error | BR-PLAN-LIST-01; CR-AUTHZ |
| Search/filter conditions | Áp dụng điều kiện search/filter hiện tại lên danh sách trả về | Gửi đúng điều kiện hiện tại, preserve state khi lỗi | BR-PLAN-LIST-02; AC-PLAN-LIST-03 |
| Date validation | Validate khoảng ngày theo CR-DATE | Validate trước khi query nếu có đủ rule; hiển thị lỗi inline/state | CR-DATE; Invalid date filter |
| Delete workflow | Enforce chỉ `Nháp` được xóa | Ẩn/disable action xóa không hợp lệ hoặc hiển thị lỗi theo API | BR-PLAN-LIST-04; AC-PLAN-LIST-10 |
| Bulk action workflow | Enforce tất cả item được chọn hợp lệ trước khi bulk action; với bulk delete tất cả item phải ở trạng thái `Nháp` | FE disable hoặc ngăn bulk delete nếu selection có bất kỳ item nào không ở trạng thái `Nháp`; API vẫn validate lại khi submit | BR-PLAN-LIST-06 & 08; AC-PLAN-LIST-06 |
| Transfer workflow | Enforce chỉ `Đã duyệt` được chuyển sang thực hiện CBM | Ẩn/disable action chuyển không hợp lệ hoặc hiển thị lỗi theo API | BR-PLAN-LIST-05 |
| Action availability | Trả `items[].availableActions` theo workflow rules và permission/scope áp dụng cho từng kế hoạch | Dùng `items[].availableActions` để hiển thị/enable row actions; không tự mở action ngoài danh sách BE trả | AC-PLAN-LIST-04 |
| Pagination | Trả total/page/pageSize phù hợp query | Hiển thị range và điều hướng trang, mặc định 50/trang | CR-PAGING |

## Data Source Notes

| Data | Source System | Contract Note |
| --- | --- | --- |
| Mã thiết bị | PMIS | Trả trong item danh sách; dùng hiển thị và search. |
| Tên thiết bị | PMIS | Trả trong item danh sách; dùng hiển thị và search. |
| Số seri thiết bị | PMIS | Trả trong response danh sách; dùng cho search và có thể dùng cho hiển thị/đối chiếu khi cần. |
| Vị trí thiết bị | PMIS | Trả trong item danh sách và dùng cho filter vị trí. |
| Đơn vị quản lý thiết bị | PMIS | Trả trong item danh sách và dùng cho filter đơn vị quản lý. |
| Danh mục đơn vị quản lý | PMIS | Tải trước bằng API filter options riêng; không bundled với list response và chưa hỗ trợ remote search trong task này. |
| Danh mục vị trí | PMIS | Tải trước bằng API filter options riêng; không bundled với list response và chưa hỗ trợ remote search trong task này. |
| Ngày thực hiện | MSM | Trả trong item danh sách và dùng cho filter ngày thực hiện. |
| Trạng thái workflow | MSM | Trả trong item danh sách; status contract hiện đang là draft tự suy từ Feature Spec và user-provided status list. |
| Nguồn tạo | MSM | Trả trong item danh sách; source coverage gồm Tạo mới, Import Excel, Đồng bộ PMIS. |
| Thời gian cập nhật | MSM | Trả trong item danh sách. |

## Open Questions / TBD

| Item | Owner | Impact |
| --- | --- | --- |
| Screen ID chính thức của màn hình danh sách kế hoạch CBM là gì? | BA | Metadata contract chưa đủ để trace screen theo chuẩn. |
| Assumed Status Contract và Assumed CBM Plan Lifecycle Rules đã đủ đúng để BE dùng làm status enum/workflow validation chính thức chưa? | BA/BE | Ảnh hưởng query param `status`, response `items[].status`, action availability, mutation validation và lifecycle implementation. |
