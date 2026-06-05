1. Mục tiêu
Là NVTN tôi muốn xem/tìm kiếm danh sách kế hoạch CBM — UC-PLAN-01 §2.1

2. Description
Theo dõi, tìm kiếm và rà soát danh sách kế hoạch CBM; thực hiện các workflow action hợp lệ theo trạng thái. Đây là màn hình trung tâm để tạo mới, import, đồng bộ PMIS, xem chi tiết, cập nhật, xóa và chuyển kế hoạch sang thực hiện.

3. Traceability
UC: UC-PLAN-01 — Quản lý kế hoạch CBM
SRS: MSM_CBM_SRS_v1.1.docx §2.1 (v1.1)
Màn UI: §2.1.2
Parent Feature: #8966
4. UI/UX
[Ảnh UI – SRS §2.1.2: Danh sách kế hoạch CBM] (sẽ nhúng ảnh thật khi có PAT)

Filter/Search (§2.1.3): Tìm kiếm (mã/tên/số seri); Ngày thực hiện (preset date range, mặc định tháng hiện tại); Trạng thái (Tất cả/Nháp/Chờ GĐXN duyệt/Đã duyệt/Từ chối/Đã chuyển); Đơn vị (PMIS); Vị trí (PMIS); Đặt lại.

Cột bảng (§2.1.4): Mã thiết bị (link→chi tiết), Tên thiết bị, Vị trí, Đơn vị quản lý, Ngày thực hiện (dd/mm/yyyy), Trạng thái (badge), Nguồn tạo, Thời gian cập nhật.

Action (§2.1.5): Tạo mới, Import Excel, Đồng bộ PMIS, Xem chi tiết, Chỉnh sửa, Xóa (confirm), Xóa nhiều, Chuyển sang thực hiện CBM, Chọn nhiều, Tùy chỉnh cột, Export.

Flow: mở màn danh sách → nhập keyword/đổi filter → reload → chọn action theo trạng thái dòng.

States (§2.1.7): default, loading, searching, filtering, empty result, invalid date filter, filter reset, row/bulk action unavailable, multi-selection, customize columns, pagination (50/trang), delete confirm/success/failed, update popup opened/success/failed.

5. Business Rule
Khi NVTN theo dõi và thao tác danh sách kế hoạch CBM, đảm bảo các rule sau:

5.1 Rule cần validate (map BR-ID của SRS §2.1.8)
BR-PLAN-LIST-01: chỉ xem kế hoạch thuộc đơn vị/phạm vi quản lý được phép.
BR-PLAN-LIST-02: hiển thị theo điều kiện search/filter hiện tại.
BR-PLAN-LIST-03: chỉ “Nháp”/“Từ chối” được cập nhật.
BR-PLAN-LIST-04: chỉ “Nháp” được xóa.
BR-PLAN-LIST-05: chỉ “Đã duyệt” được chuyển sang thực hiện CBM.
BR-PLAN-LIST-06 & 08: bulk action chỉ khi tất cả kế hoạch được chọn đều hợp lệ.
BR-PLAN-LIST-07: cấu hình cột áp dụng trên danh sách hiện tại.
5.2 Trường dữ liệu & nguồn
Thông tin thiết bị (nguồn: PMIS — CR-DATASOURCE): Mã thiết bị, Tên thiết bị, Vị trí, Đơn vị quản lý.
Thông tin kế hoạch (nguồn: MSM): Ngày thực hiện, Trạng thái workflow, Nguồn tạo, Thời gian cập nhật.
5.3 Rule dùng chung (link — không copy)
Phân trang: CR-PAGING
Quyền truy cập: CR-AUTHZ
Trạng thái workflow: CR-STATES
Ngày thực hiện: CR-DATE
6. Acceptance Criteria (§2.1.9)
AC-PLAN-LIST-01: Người dùng có thể tìm kiếm kế hoạch theo mã thiết bị, tên thiết bị hoặc số seri thiết bị.
AC-PLAN-LIST-02: Người dùng có thể lọc danh sách kế hoạch theo ngày thực hiện, trạng thái kế hoạch, đơn vị quản lý và vị trí.
AC-PLAN-LIST-03: Khi người dùng thay đổi điều kiện tìm kiếm hoặc filter, hệ thống reload danh sách kế hoạch tương ứng.
AC-PLAN-LIST-04: Hệ thống chỉ hiển thị các workflow action hợp lệ theo trạng thái của từng kế hoạch.
AC-PLAN-LIST-05: Người dùng có thể chọn nhiều kế hoạch để thực hiện bulk action phù hợp.
AC-PLAN-LIST-06: Hệ thống không cho thực hiện bulk action nếu tồn tại kế hoạch không hợp lệ với workflow action tương ứng.
AC-PLAN-LIST-07: Người dùng có thể tùy chỉnh hiển thị cột dữ liệu trên danh sách kế hoạch CBM.
AC-PLAN-LIST-08: Khi không có dữ liệu phù hợp với điều kiện tìm kiếm hoặc filter, hệ thống hiển thị trạng thái empty result.
AC-PLAN-LIST-09: Người dùng có thể xóa kế hoạch ở trạng thái “Nháp” sau khi xác nhận thao tác xóa.
AC-PLAN-LIST-10: Hệ thống không cho xóa kế hoạch nếu kế hoạch không ở trạng thái “Nháp”.
AC-PLAN-LIST-11: Người dùng có thể xóa nhiều kế hoạch nếu tất cả kế hoạch được chọn đều thỏa điều kiện xóa.
AC-PLAN-LIST-12: Người dùng có thể mở popup cập nhật kế hoạch từ danh sách nếu kế hoạch ở trạng thái cho phép cập nhật.
AC-PLAN-LIST-13: Sau khi cập nhật kế hoạch thành công, hệ thống reload danh sách và hiển thị dữ liệu mới nhất.
Validate được thực hiện ở cả FE và BE.
Khi thành công: cập nhật dữ liệu đúng trạng thái + thông báo thành công, reload danh sách.
Khi thất bại: hiển thị lỗi phù hợp, giữ nguyên dữ liệu hiện tại.
7. Ngoài phạm vi / Phụ thuộc
Ngoài phạm vi: popup Tạo mới (PBI 02), Import (PBI 03), Đồng bộ (PBI 04), chi tiết/cập nhật (PBI 05).
Phụ thuộc: danh mục đơn vị/vị trí từ PMIS.
8. CR / Versioning
Áp dụng theo SRS version v1.1. CR sau này: nêu hiện trạng + link version cũ → mới và mô tả thay đổi.