# AI USAGE & ENGINEERING PRACTICE LOG (NHẬT KÝ SỬ DỤNG AI CÓ KIỂM SOÁT)

> **Căn cứ**: Mục 0.3, 9.1, 9.2, 9.3 & 9.4 tài liệu hướng dẫn Assignment 01 SBA301.  
> **Nguyên tắc**: Sinh viên sử dụng AI như một trợ lý kỹ thuật hỗ trợ phân tích thiết kế, gợi ý cấu trúc dữ liệu và sinh test matrix; sinh viên tự kiểm chứng toàn bộ code, nắm vững 100% luồng thực thi và chịu trách nhiệm bảo vệ trước hội đồng đánh giá.

---

## Bảng nhật ký khai báo sử dụng AI (Section 9.4 Rubric)

| # | Prompt (Câu lệnh đưa vào AI) | Mục đích (Goal) | Gợi ý của AI (AI Suggestion) | Cách tôi đã kiểm chứng (Verification) | Phần tôi đã điều chỉnh & hoàn thiện (Adaptation) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | *"Thiết kế một vector logo SVG chuyên nghiệp cho hệ thống FUNewsManagementSystem với phong cách báo điện tử công nghệ đại học FPT."* | Tạo tài nguyên nhận diện thương hiệu theo tiêu chí R04 của Assignment. | Cung cấp mã SVG chứa biểu tượng tờ báo và bút lông kỹ thuật số với gradient màu xanh dương và cam. | Nhúng mã SVG vào file `public/assets/logo.svg` và xem thử trực tiếp trên trình duyệt ở nhiều độ phân giải khác nhau. | Tinh chỉnh lại viewBox `0 0 120 120`, tối ưu bán kính bo góc và thêm nhãn "FU" nhỏ nét đậm để logo hiển thị sắc nét trên cả Sidebar và Header. |
| **2** | *"Đề xuất cấu trúc State Ownership chuẩn cho ứng dụng SPA ReactJS quản trị tin tức gồm 5 phân hệ với CRUD và Popup Modal."* | Thiết lập kiến trúc quản lý state hợp lý, tránh tình trạng prop drilling hoặc memory leak. | Gợi ý tách biệt Local UI State, Form State gắn với Modal, Shared Data trong Service, và Auth State lưu Storage. | Vẽ sơ đồ Component Tree và đối chiếu với luồng truyền dữ liệu giữa `App.jsx`, `AdminLayout.jsx` và các trang con. | Quyết định không sử dụng thêm thư viện state bên ngoài (như Redux) để giữ cho dự án nhẹ nhàng, dễ bảo vệ và phù hợp với scope môn học. |
| **3** | *"Gợi ý các trường dữ liệu bắt buộc và ràng buộc toàn vẹn giữa hai bảng Category và News trong hệ thống quản trị bài viết."* | Xây dựng Data Model hợp lý theo tiêu chí R12 và chuẩn bị cho việc kết nối Spring Boot sau này. | News cần tham chiếu `categoryId` của Category; Category có `status` (0/1); News có `tags`, `createdBy`, `createdAt`. | Kiểm tra tính tương thích với mô hình cơ sở dữ liệu quan hệ (Relational Database) và cấu trúc Entity trong JPA Hibernate. | Bổ sung hàm kiểm tra chặn xóa Category nếu đang có News tham chiếu (`categoryService.delete`) để chống lỗi dữ liệu mồ côi (Orphan records). |
| **4** | *"Lập bảng Test Matrix bao phủ 35 trường hợp kiểm thử cho ứng dụng quản trị React theo rubric môn SBA301."* | Xây dựng ma trận kiểm thử chi tiết gồm Happy path, Negative validation và Edge cases. | Đưa ra danh sách 35 ca kiểm thử bao quát Login, Auth, Layout, Navigation, Category, News, Users, Persistence. | Tự tay thao tác từng bước kiểm thử trên giao diện thực tế của ứng dụng đang chạy ở `localhost:3000`. | Điền kết quả thực tế (Actual / PASS) vào bảng `TEST_MATRIX.md`, bổ sung các bước xử lý trường hợp mảng rỗng và làm sạch bộ lọc. |

---

## Bản cam kết trung thực học thuật (Academic Integrity Declaration)

Sinh viên tự xác nhận:
- Tôi đã trực tiếp cài đặt môi trường, chạy thử nghiệm dự án trên máy tính cá nhân và kiểm tra toàn bộ 35/35 trường hợp kiểm thử.
- Tôi hoàn toàn hiểu rõ trách nhiệm của từng file mã nguồn, luồng biến đổi của state, chu trình re-render của component và sẵn sàng trả lời phỏng vấn cũng như thực hiện các yêu cầu thay đổi (Transfer Task) từ giảng viên mà không cần sự trợ giúp từ bên ngoài.
