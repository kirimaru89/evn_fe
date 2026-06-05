# Danh sách kế hoạch CBM

## Metadata

| Field | Value |
| --- | --- |
| Module | Thí nghiệm CBM |
| Module slug | thi-nghiem-cbm |
| Feature ID | #8966 |
| Use Case ID | UC-PLAN-01 |
| Screen ID | TBD(BA) |
| Version | 1.1 |
| Status | TBD(BA) |
| Owner | TBD(BA) |
| Last updated | TBD(BA) |
| Source documents | MSM_CBM_SRS_v1.1.docx §2.1, §2.1.2, §2.1.3, §2.1.4, §2.1.5, §2.1.7, §2.1.8, §2.1.9; `.specs/thi-nghiem-cbm/01-danh-sach-ke-hoach-cbm/spec.md`; `.specs/thi-nghiem-cbm/01-danh-sach-ke-hoach-cbm/wire-frame.md` |

## User Story

Là `NVTN`, tôi muốn `xem và tìm kiếm danh sách kế hoạch CBM` để `theo dõi, rà soát và thực hiện các workflow action hợp lệ theo trạng thái kế hoạch`.

## Business Context

Màn hình danh sách kế hoạch CBM là màn hình trung tâm để NVTN theo dõi, tìm kiếm, lọc và xử lý các kế hoạch CBM theo phạm vi quản lý được phép. Từ danh sách này, người dùng có thể mở các thao tác liên quan như tạo mới, import, đồng bộ PMIS, xem chi tiết, cập nhật, xóa, xóa nhiều, tùy chỉnh cột, export và chuyển kế hoạch sang thực hiện CBM theo trạng thái hợp lệ.

### Scope

- Hiển thị danh sách kế hoạch CBM theo phạm vi quản lý được phép.
- Tìm kiếm kế hoạch theo mã thiết bị, tên thiết bị hoặc số seri thiết bị.
- Lọc danh sách theo ngày thực hiện, trạng thái kế hoạch, đơn vị quản lý và vị trí.
- Hiển thị các cột dữ liệu danh sách kế hoạch CBM theo SRS §2.1.4.
- Hiển thị trạng thái workflow của từng kế hoạch.
- Hiển thị và kiểm soát action hợp lệ theo trạng thái kế hoạch.
- Cho phép chọn nhiều kế hoạch và thực hiện bulk action khi tất cả kế hoạch được chọn đều hợp lệ.
- Hỗ trợ xác nhận xóa kế hoạch và xóa nhiều kế hoạch.
- Hỗ trợ tùy chỉnh cột hiển thị trên danh sách hiện tại.
- Hỗ trợ phân trang với kích thước 50 bản ghi/trang.
- Hiển thị các trạng thái màn hình: default, loading, searching, filtering, empty result, invalid date filter, filter reset, row/bulk action unavailable, multi-selection, customize columns, pagination, delete confirm/success/failed, update popup opened/success/failed.

### Out of Scope

- Popup Tạo mới kế hoạch CBM thuộc PBI 02.
- Import Excel thuộc PBI 03.
- Đồng bộ PMIS thuộc PBI 04.
- Chi tiết kế hoạch và cập nhật kế hoạch thuộc PBI 05.
- Nội dung xử lý sâu của popup cập nhật; màn danh sách chỉ mở popup khi kế hoạch ở trạng thái cho phép cập nhật.

## UI / UX

### ASCII Wireframe

```txt
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
|    | [ ] | MBA002 | Máy biến áp T2 | Trạm 110kV ĐA | EVNHN  | 16/06 | Chờ GĐXN duyệt | Import  | 10/06 10:15 | ... |
|    | [ ] | MBA003 | Máy biến áp T3 | Trạm 110kV GL | EVNBAC | 17/06 | Đã duyệt  | PMIS    | 11/06 08:45 | ... |
|----+-----------------------------------------------------------------------------------------------------------------|
+----+-----------------------------------------------------------------------------------------------------------------+
```

### Screen Regions

| Region | Description |
| --- | --- |
| Global shell | Hiển thị ngữ cảnh MSM Portal / Thí nghiệm CBM / Theo dõi kế hoạch CBM, tìm kiếm hệ thống, trợ giúp và thông tin người dùng. |
| Page header | Hiển thị tiêu đề `Theo dõi kế hoạch CBM`, mô tả màn hình, range bản ghi hiện tại, tổng số bản ghi và điều hướng phân trang nhanh. |
| Page actions | Hiển thị các action cấp màn hình: Import, PMIS, Tạo mới, Export danh sách kế hoạch, tùy chỉnh cột hiển thị. |
| Filter panel | Cho phép tìm kiếm theo mã thiết bị/tên thiết bị/số seri và lọc theo ngày thực hiện, trạng thái, đơn vị quản lý, vị trí; có action đặt lại filter. |
| Bulk action bar | Chỉ hiển thị khi số kế hoạch được chọn lớn hơn 0; hiển thị số lượng đã chọn và action xóa nhiều kế hoạch. |
| Data table | Hiển thị danh sách kế hoạch CBM, checkbox chọn dòng, cột dữ liệu, trạng thái, nguồn tạo, thời gian cập nhật và action theo từng dòng. |
| Pagination | Hiển thị và thay đổi trang dữ liệu danh sách, mặc định 50 bản ghi/trang theo source spec. |

### Actions

| Action | Trigger | Availability | Result |
| --- | --- | --- | --- |
| Tìm kiếm kế hoạch | Search input | Khi người dùng nhập mã thiết bị, tên thiết bị hoặc số seri thiết bị | Reload danh sách theo keyword hiện tại. |
| Lọc ngày thực hiện | Date range filter | Mặc định tháng hiện tại; hỗ trợ preset và khoảng ngày tùy chỉnh theo source spec | Reload danh sách theo khoảng ngày thực hiện. |
| Lọc trạng thái kế hoạch | Status filter | Tất cả/Nháp/Chờ GĐXN duyệt/Đã duyệt/Từ chối/Đã chuyển sang thực hiện | Reload danh sách theo trạng thái được chọn. |
| Lọc đơn vị quản lý | Đơn vị filter | Danh mục đơn vị lấy từ PMIS | Reload danh sách theo đơn vị quản lý. |
| Lọc vị trí | Vị trí filter | Danh mục vị trí lấy từ PMIS | Reload danh sách theo vị trí. |
| Đặt lại filter | Button `Đặt lại` | Khi có điều kiện search/filter đang áp dụng hoặc theo hành vi reset của màn hình | Reset điều kiện filter/search và reload danh sách. |
| Tạo mới kế hoạch | Page action | Action hiển thị trên màn danh sách; xử lý popup tạo mới ngoài phạm vi spec này | Mở luồng/popup tạo mới theo PBI 02. |
| Import Excel | Page action | Action hiển thị trên màn danh sách; xử lý import ngoài phạm vi spec này | Mở luồng import theo PBI 03. |
| Đồng bộ PMIS | Page action `PMIS` | Action hiển thị trên màn danh sách; xử lý đồng bộ ngoài phạm vi spec này | Mở luồng đồng bộ PMIS theo PBI 04. |
| Export danh sách kế hoạch | Page action | Có trên danh sách kế hoạch CBM | Export theo danh sách hiện tại, filter hiện tại và cột đang hiển thị. |
| Tùy chỉnh cột hiển thị | Table utility | Có trên danh sách kế hoạch CBM | Áp dụng cấu hình cột trên danh sách hiện tại; không lưu cấu hình cột phía server theo user/session. |
| Xem chi tiết kế hoạch | Row action hoặc link mã thiết bị | Có trên từng kế hoạch trong danh sách | Mở chi tiết kế hoạch theo PBI 05. |
| Chỉnh sửa kế hoạch | Row action | Chỉ kế hoạch trạng thái `Nháp` hoặc `Từ chối` được cập nhật | Mở popup cập nhật kế hoạch. |
| Xóa kế hoạch | Row action | Chỉ kế hoạch trạng thái `Nháp` được xóa | Hiển thị xác nhận xóa; khi xác nhận thành công thì xóa kế hoạch và reload danh sách. |
| Chuyển sang thực hiện CBM | Row action | Chỉ kế hoạch trạng thái `Đã duyệt` được chuyển sang thực hiện CBM | Chuyển kế hoạch sang thực hiện CBM theo workflow hợp lệ. |
| Chọn nhiều kế hoạch | Checkbox selection | Có trên bảng danh sách | Hiển thị bulk action bar khi có ít nhất một kế hoạch được chọn. |
| Xóa nhiều kế hoạch | Bulk action | Chỉ khi tất cả kế hoạch được chọn đều hợp lệ với điều kiện xóa | Hiển thị xác nhận xóa nhiều; khi thành công thì xóa các kế hoạch đã chọn và reload danh sách. |

### Screen States

| State | Condition | Expected Behavior |
| --- | --- | --- |
| Default | Người dùng mở màn danh sách | Hiển thị dữ liệu danh sách kế hoạch CBM theo filter mặc định, trong đó ngày thực hiện mặc định là tháng hiện tại. |
| Loading | Đang tải dữ liệu bảng | Hiển thị trạng thái tải dữ liệu và không làm mất điều kiện filter/search hiện tại. |
| Searching | Người dùng nhập hoặc thay đổi keyword | Reload danh sách theo mã thiết bị, tên thiết bị hoặc số seri thiết bị. |
| Filtering | Người dùng thay đổi điều kiện lọc | Reload danh sách theo điều kiện lọc hiện tại. |
| Empty | Không có dữ liệu danh sách | Hiển thị trạng thái không có dữ liệu. |
| No result | Không có dữ liệu phù hợp với search/filter | Hiển thị trạng thái empty result theo AC-PLAN-LIST-08. |
| Invalid date filter | Khoảng ngày thực hiện không hợp lệ | Hiển thị lỗi validation cho filter ngày thực hiện; không làm mất điều kiện đã nhập. |
| Filter reset | Người dùng chọn đặt lại filter | Reset điều kiện search/filter và reload danh sách. |
| Row action unavailable | Action dòng không hợp lệ theo trạng thái kế hoạch | Không cho thực hiện action không hợp lệ và chỉ hiển thị hoặc cho phép workflow action hợp lệ theo trạng thái. |
| Bulk action unavailable | Có ít nhất một kế hoạch được chọn không hợp lệ với bulk action; với bulk delete là có ít nhất một kế hoạch được chọn không ở trạng thái `Nháp` | FE disable hoặc ngăn thực hiện bulk action theo AC-PLAN-LIST-06; API vẫn validate lại khi nhận request. |
| Multi-selection | Số kế hoạch được chọn lớn hơn 0 | Hiển thị bulk action bar với số lượng kế hoạch đã chọn. |
| Customize columns | Người dùng tùy chỉnh cột hiển thị | Cấu hình cột được áp dụng trên danh sách hiện tại. |
| Pagination | Người dùng đổi trang hoặc danh sách có nhiều hơn 50 bản ghi | Hiển thị dữ liệu theo trang, 50 bản ghi/trang. |
| Delete confirmation | Người dùng chọn xóa hoặc xóa nhiều | Hiển thị xác nhận trước khi xóa. |
| Delete success | Xóa kế hoạch hoặc xóa nhiều thành công | Hiển thị thông báo thành công và reload danh sách. |
| Delete failed | Xóa kế hoạch hoặc xóa nhiều thất bại | Hiển thị lỗi phù hợp, giữ nguyên dữ liệu hiện tại. |
| Update popup opened | Người dùng mở cập nhật kế hoạch từ danh sách với trạng thái cho phép cập nhật | Mở popup cập nhật kế hoạch theo PBI 05. |
| Update success | Cập nhật kế hoạch thành công từ popup | Reload danh sách và hiển thị dữ liệu mới nhất. |
| Update failed | Cập nhật kế hoạch thất bại từ popup | Hiển thị lỗi phù hợp, giữ nguyên dữ liệu hiện tại. |

## Data Model / Fields

### Business Entity Fields

| Field | Type | Required | Source | Validation |
| --- | --- | --- | --- | --- |
| Mã thiết bị | Text / Link | Yes | PMIS | Dùng để hiển thị, tìm kiếm và mở chi tiết kế hoạch. |
| Tên thiết bị | Text | Yes | PMIS | Dùng để hiển thị và tìm kiếm. |
| Số seri thiết bị | Text | Yes | PMIS | API trả trong response danh sách; dùng để tìm kiếm và có thể dùng cho hiển thị/đối chiếu khi cần. |
| Vị trí thiết bị | Text | Yes | PMIS | Hiển thị trong bảng và dùng cho filter vị trí. |
| Đơn vị quản lý thiết bị | Text | Yes | PMIS | Hiển thị trong bảng và dùng cho filter đơn vị quản lý. |
| Ngày thực hiện kế hoạch | Date | Yes | MSM | Hiển thị định dạng `dd/mm/yyyy`; áp dụng CR-DATE. |
| Trạng thái workflow | Enum | Yes | MSM | Hiển thị badge trạng thái; action hợp lệ phụ thuộc trạng thái. |
| Nguồn tạo kế hoạch | Enum / Text | Yes | MSM | Giá trị source coverage: Tạo mới, Import Excel, Đồng bộ PMIS. |
| Thời gian cập nhật | DateTime | Yes | MSM | Hiển thị thời gian cập nhật kế hoạch. |

### Search / Filter Fields

| Field | Type | Required | Source | Validation |
| --- | --- | --- | --- | --- |
| Tìm kiếm kế hoạch | Text | No | User input | Tìm kiếm theo mã thiết bị, tên thiết bị hoặc số seri thiết bị. |
| Ngày thực hiện | Date range | No | User input | Mặc định tháng hiện tại; áp dụng CR-DATE; khoảng ngày không hợp lệ phải hiển thị lỗi validation. |
| Trạng thái kế hoạch | Enum | No | User input / MSM | Giá trị filter: Tất cả, Nháp, Chờ GĐXN duyệt, Đã duyệt, Từ chối, Đã chuyển sang thực hiện. |
| Đơn vị quản lý | Enum | No | PMIS | Lọc danh sách theo đơn vị quản lý từ PMIS. |
| Vị trí | Enum | No | PMIS | Lọc danh sách theo vị trí từ PMIS. |

### Display / Derived Fields

| Field | Type | Required | Source | Validation |
| --- | --- | --- | --- | --- |
| Tổng số bản ghi | Number | Yes | MSM | Hiển thị tổng số bản ghi danh sách theo điều kiện hiện tại. |
| Current range | Text | Yes | Derived from pagination | Hiển thị range hiện tại, ví dụ `Hiển thị 1-50 trên 236`. |
| Actions | List | Yes | MSM / API response, derived from workflow rules | BE trả danh sách action hợp lệ cho từng kế hoạch; action phải tuân thủ workflow rules. |

### Selection / Interaction Fields

| Field | Type | Required | Source | Validation |
| --- | --- | --- | --- | --- |
| Checkbox Selection | Boolean | No | User input | Cho phép chọn một hoặc nhiều kế hoạch để thực hiện bulk action hợp lệ. |

## Business Rules

### Workflow Rules

- `BR-PLAN-LIST-03`: Chỉ kế hoạch trạng thái `Nháp` hoặc `Từ chối` được cập nhật.
- `BR-PLAN-LIST-04`: Chỉ kế hoạch trạng thái `Nháp` được xóa.
- `BR-PLAN-LIST-05`: Chỉ kế hoạch trạng thái `Đã duyệt` được chuyển sang thực hiện CBM.
- `BR-PLAN-LIST-06 & 08`: Bulk action chỉ được thực hiện khi tất cả kế hoạch được chọn đều hợp lệ với workflow action tương ứng.

### Assumed CBM Plan Lifecycle Rules

Các lifecycle rules dưới đây là **tự suy từ status list và workflow/action rules hiện có trong source spec**. Chưa phải lifecycle được BA/BE phê duyệt đầy đủ.

#### Status Catalog

| Status | Label | Source / Basis | Notes |
| --- | --- | --- | --- |
| draft | Nháp | Source spec status/action rules | Cho phép cập nhật và xóa. |
| pendingDirectorApproval | Chờ GĐXN duyệt | User-provided canonical status list | Không thấy action cập nhật/xóa/chuyển trong list screen. |
| approved | Đã duyệt | Source spec status/action rules | Cho phép chuyển sang thực hiện CBM. |
| rejected | Từ chối | Source spec status/action rules | Cho phép cập nhật. |
| transferredToExecution | Đã chuyển sang thực hiện | User-provided canonical status list | Assumed là trạng thái sau action `Chuyển sang thực hiện CBM`. |

#### Assumed Transitions

| Current Status | Action | Next Status | Basis | Notes |
| --- | --- | --- | --- | --- |
| Nháp | Gửi duyệt | Chờ GĐXN duyệt | Tự suy từ lifecycle thông thường và status list | Action `Gửi duyệt` chưa nằm trong màn danh sách này. |
| Chờ GĐXN duyệt | Duyệt | Đã duyệt | Tự suy từ status list | Actor/permission duyệt chưa được source spec màn danh sách mô tả. |
| Chờ GĐXN duyệt | Từ chối | Từ chối | Tự suy từ status list | Actor/permission từ chối chưa được source spec màn danh sách mô tả. |
| Từ chối | Cập nhật / gửi lại | Chờ GĐXN duyệt | Tự suy từ rule `Từ chối` được cập nhật | Action gửi lại chưa được source spec màn danh sách mô tả. |
| Đã duyệt | Chuyển sang thực hiện CBM | Đã chuyển sang thực hiện | Source rule BR-PLAN-LIST-05 + user-provided status list | Assumed next status là `Đã chuyển sang thực hiện`. |

#### Action Availability By Status

| Status | View Detail | Edit | Delete | Transfer To Execution |
| --- | --- | --- | --- | --- |
| Nháp | Yes | Yes | Yes | No |
| Chờ GĐXN duyệt | Yes | No | No | No |
| Đã duyệt | Yes | No | No | Yes |
| Từ chối | Yes | Yes | No | No |
| Đã chuyển sang thực hiện | Yes | No | No | No |

### Permission Rules

- `BR-PLAN-LIST-01`: Người dùng chỉ xem kế hoạch thuộc đơn vị/phạm vi quản lý được phép.
- `CR-AUTHZ`: Quyền truy cập áp dụng theo rule dùng chung; path hoặc nội dung rule chi tiết là TBD(BA/BE).

### Validation Rules

- `CR-DATE`: Ngày thực hiện áp dụng rule ngày dùng chung; path hoặc nội dung rule chi tiết là TBD(BA/BE).
- `Invalid date filter`: Khoảng ngày thực hiện không hợp lệ phải được validate và hiển thị lỗi.
- `Bulk action validation`: Hệ thống không cho thực hiện bulk action nếu tồn tại kế hoạch không hợp lệ với workflow action tương ứng. Với bulk delete, không hợp lệ nghĩa là có ít nhất một kế hoạch được chọn không ở trạng thái `Nháp`.
- `Delete validation`: Hệ thống không cho xóa kế hoạch nếu kế hoạch không ở trạng thái `Nháp`.
- `FE/BE validation`: Validate được thực hiện ở cả FE và BE theo source spec.

### Lifecycle Rules

- `CR-STATES`: Trạng thái workflow áp dụng theo rule dùng chung; path hoặc nội dung rule chi tiết là TBD(BA/BE).
- `Delete lifecycle`: Khi xóa thành công, dữ liệu danh sách được cập nhật và reload theo điều kiện hiện tại.
- `Update lifecycle`: Khi cập nhật thành công từ popup, danh sách reload và hiển thị dữ liệu mới nhất.
- `Transfer lifecycle`: Kế hoạch trạng thái `Đã duyệt` có thể được chuyển sang thực hiện CBM.

### Other Business Rules

- `BR-PLAN-LIST-02`: Danh sách hiển thị theo điều kiện search/filter hiện tại.
- `BR-PLAN-LIST-07`: Cấu hình cột áp dụng trên danh sách hiện tại và không lưu phía server theo user/session.
- `Export behavior`: Export danh sách kế hoạch theo danh sách hiện tại, filter hiện tại và cột đang hiển thị.
- `CR-PAGING`: Phân trang áp dụng theo rule dùng chung; source spec nêu pagination 50 bản ghi/trang.
- `CR-DATASOURCE`: Thông tin thiết bị lấy từ PMIS; thông tin kế hoạch lấy từ MSM.

## Acceptance Criteria

### FE-visible AC

1. `AC-PLAN-LIST-01`: Người dùng có thể tìm kiếm kế hoạch theo mã thiết bị, tên thiết bị hoặc số seri thiết bị.
2. `AC-PLAN-LIST-02`: Người dùng có thể lọc danh sách kế hoạch theo ngày thực hiện, trạng thái kế hoạch, đơn vị quản lý và vị trí.
3. `AC-PLAN-LIST-03`: Khi người dùng thay đổi điều kiện tìm kiếm hoặc filter, hệ thống reload danh sách kế hoạch tương ứng.
4. `AC-PLAN-LIST-04`: Hệ thống chỉ hiển thị các workflow action hợp lệ theo trạng thái của từng kế hoạch.
5. `AC-PLAN-LIST-05`: Người dùng có thể chọn nhiều kế hoạch để thực hiện bulk action phù hợp.
6. `AC-PLAN-LIST-07`: Người dùng có thể tùy chỉnh hiển thị cột dữ liệu trên danh sách kế hoạch CBM.
7. `AC-PLAN-LIST-08`: Khi không có dữ liệu phù hợp với điều kiện tìm kiếm hoặc filter, hệ thống hiển thị trạng thái empty result.
8. `AC-PLAN-LIST-09`: Người dùng có thể xóa kế hoạch ở trạng thái `Nháp` sau khi xác nhận thao tác xóa.
9. `AC-PLAN-LIST-12`: Người dùng có thể mở popup cập nhật kế hoạch từ danh sách nếu kế hoạch ở trạng thái cho phép cập nhật.
10. Khi thành công, hệ thống hiển thị thông báo thành công và reload danh sách.
11. Khi thất bại, hệ thống hiển thị lỗi phù hợp và giữ nguyên dữ liệu hiện tại.

### BE / API AC

1. Danh sách kế hoạch trả về đúng phạm vi đơn vị/phạm vi quản lý được phép của người dùng.
2. Danh sách kế hoạch trả về theo điều kiện search/filter hiện tại.
3. Search hỗ trợ mã thiết bị, tên thiết bị và số seri thiết bị.
4. Filter hỗ trợ ngày thực hiện, trạng thái kế hoạch, đơn vị quản lý và vị trí.
5. Dữ liệu thiết bị lấy từ PMIS gồm mã thiết bị, tên thiết bị, vị trí và đơn vị quản lý.
6. Dữ liệu kế hoạch lấy từ MSM gồm ngày thực hiện, trạng thái workflow, nguồn tạo và thời gian cập nhật.
7. Phân trang hỗ trợ kích thước 50 bản ghi/trang theo source spec.
8. Sau khi cập nhật kế hoạch thành công, danh sách trả về dữ liệu mới nhất theo điều kiện hiện tại.

### Validation / Error AC

1. `AC-PLAN-LIST-06`: Hệ thống không cho thực hiện bulk action nếu tồn tại kế hoạch không hợp lệ với workflow action tương ứng.
2. `AC-PLAN-LIST-10`: Hệ thống không cho xóa kế hoạch nếu kế hoạch không ở trạng thái `Nháp`.
3. `AC-PLAN-LIST-11`: Người dùng có thể xóa nhiều kế hoạch nếu tất cả kế hoạch được chọn đều thỏa điều kiện xóa.
4. Validate được thực hiện ở cả FE và BE.
5. Khi validation thất bại, hệ thống hiển thị lỗi phù hợp và giữ nguyên dữ liệu hiện tại.
6. Khi hệ thống lỗi, hệ thống hiển thị lỗi phù hợp và giữ nguyên dữ liệu hiện tại.
7. Khi filter ngày thực hiện không hợp lệ, hệ thống hiển thị lỗi validation cho filter ngày thực hiện.
8. Khi API timeout hoặc response rỗng, hệ thống hiển thị trạng thái lỗi hoặc empty phù hợp theo dữ liệu trả về.

## Open Questions / TBD

| Item | Owner | Impact |
| --- | --- | --- |
| Screen ID chính thức của màn hình danh sách kế hoạch CBM là gì? | BA | Metadata chưa đủ để trace screen theo chuẩn. |
| Status, Owner và Last updated của Feature Spec là gì? | BA | Metadata chưa đủ để xác định trạng thái phê duyệt spec. |
| Assumed CBM Plan Lifecycle Rules đã đủ đúng để dùng làm shared lifecycle rule chính thức chưa? | BA/BE | Ảnh hưởng status transition, action availability, API validation và implementation lifecycle logic. |
