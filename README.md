# TaskFlow Personal - Ứng dụng Quản lý Công việc Cá nhân (TODO App)

Ứng dụng web hỗ trợ quản lý danh sách công việc cá nhân hằng ngày với giao diện trực quan, không sử dụng cơ sở dữ liệu (lưu trữ qua Mock Data và LocalStorage) và chạy trên nền tảng Node.js.

## 1. Các chức năng chính của hệ thống

1. **Quản lý danh sách công việc trong ngày (Today Tasks):**
   - Mặc định hiển thị các công việc cần làm trong ngày hôm nay (`Hôm nay`), hỗ trợ chuyển đổi sang chế độ xem `Tất cả các ngày`.
   - Tìm kiếm nhanh công việc theo từ khóa (tiêu đề hoặc ghi chú).
   - Lọc công việc theo trạng thái (`Tất cả`, `Chưa hoàn thành`, `Đã hoàn thành`).
2. **Thao tác CRUD đầy đủ (Thêm - Sửa - Xóa):**
   - **Thêm mới:** Tạo task với tiêu đề, ngày thực hiện, mức độ ưu tiên (`Cao`, `Trung bình`, `Thấp`) và ghi chú.
   - **Cập nhật / Sửa:** Chỉnh sửa thông tin task hoặc đánh dấu hoàn thành trực tiếp qua checkbox.
   - **Xóa:** Xóa công việc khỏi danh sách kèm hộp thoại xác nhận.
3. **Trang Thống kê (Analytics):**
   - Hiển thị các chỉ số tổng quan: Tổng số task, Số task đã hoàn thành, Số task đang thực hiện và Tỷ lệ hoàn thành (%).
   - Trực quan hóa dữ liệu bằng biểu đồ tròn (tỷ lệ trạng thái) và biểu đồ cột (hiệu suất hoàn thành theo ngày trong tuần với dữ liệu mẫu).

## 2. Công nghệ sử dụng
- **Backend:** Node.js (`http`, `fs`, `path` built-in modules)
- **Frontend:** HTML5, Tailwind CSS (CDN), JavaScript (ES6+), Chart.js
- **Lưu trữ dữ liệu:** Mock Data & Browser LocalStorage (Không sử dụng CSDL)

## 3. Hướng dẫn cài đặt và chạy chương trình
1. Clone repository về máy:
   ```bash
   git clone <link-repo-cua-ban>