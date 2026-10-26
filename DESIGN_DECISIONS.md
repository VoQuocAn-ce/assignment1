# DESIGN DECISION RECORD (BẢNG GHI QUYẾT ĐỊNH THIẾT KẾ)

> **Mục tiêu**: Chứng minh sinh viên hiểu rõ lý do lựa chọn các giải pháp kỹ thuật, đánh giá ưu/nhược điểm (trade-offs) và khả năng thích ứng khi có sự thay đổi yêu cầu từ phía giảng viên / doanh nghiệp.

---

## Bảng ghi 6 quyết định thiết kế cốt lõi (Section 3.6 Rubric)

| # | Quyết định kỹ thuật | Lựa chọn của tôi | Lý do lựa chọn (Reasoning) | Ảnh hưởng nếu thay đổi yêu cầu (Impact of Change) |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Navigation (Điều hướng trang)** | **State-based SPA Navigation** (sử dụng `activeTab` kết hợp với conditional rendering trong App / AdminLayout). | Đơn giản, trực quan, loại bỏ các lỗi 404 khi deploy static hoặc reload trên máy chấm; không cần thêm router dependency cồng kềnh trong scope Assignment 01; dễ dàng giải thích luồng render. | Nếu đề bài yêu cầu URL path phản ánh trang (Deep Linking / Browser Back-Forward), ta chỉ cần bọc `BrowserRouter` từ thư viện `react-router-dom` và thay `activeTab` bằng `<Routes>` và `<Route path="...">`. |
| **2** | **State Ownership (Phân cấp quản lý State)** | **Tách bạch 4 tầng state**: Local UI state trong Component, Form State trong Modal, Shared Data trong Data Service, Auth State tại App Root và lưu vào Storage. | Tránh prop drilling không cần thiết; Modal đóng thì giải phóng Form State để tránh memory leak và không giữ giá trị rác; Auth state kiểm soát toàn bộ vòng đời truy cập của ứng dụng. | Nếu chuyển sang Redux Toolkit hoặc React Context API, chỉ cần bọc Provider ở root và chuyển các hàm trong service layer vào Slice/Thunk mà không phải sửa logic hiển thị của các trang. |
| **3** | **Mock Data Persistence (Lưu trữ dữ liệu)** | **Client-side LocalStorage Engine** với cơ chế Fallback Hydration từ Seed Data. | Dữ liệu không bị mất sau khi reload trình duyệt (F5); độc lập không phụ thuộc backend mạng ngoài; sinh viên và giảng viên có thể test create/update/delete trực quan nhiều lần. | Khi tích hợp Spring Boot RESTful API (Lab 04/05), chỉ cần thay thế các hàm trong `src/services/*.js` thành các lời gọi `fetch()` hoặc `axios.get/post/put/delete` tới URL backend (`http://localhost:8080/api/...`). |
| **4** | **CRUD Dialog Reuse (Tái sử dụng Dialog)** | **Single Modal Component** nhận `mode` ('create' \| 'edit') và props động (`title`, `formData`, `onSubmit`, `onClose`). | Tránh trùng lặp code HTML/CSS giữa 2 modal; đồng nhất trải nghiệm người dùng; dễ dàng quản lý focus và validation tập trung một nơi duy nhất. | Nếu form Create và Update khác nhau lớn về fields (ví dụ Create nhập password, Update chỉ đổi role), có thể tách schema validation hoặc render conditional fields dựa trên `mode === 'edit'`. |
| **5** | **Search Strategy (Chiến lược tìm kiếm)** | **Non-destructive In-memory Filter** (sử dụng `useMemo` tính toán `displayedList` từ `sourceList` dựa trên normalized keyword). | Giữ nguyên danh sách gốc (`sourceList`), không bị mất dữ liệu khi xóa từ khóa search; tìm kiếm không phân biệt hoa/thường, tự động loại bỏ khoảng trắng thừa (`trim()`). | Khi lượng dữ liệu lớn lên hàng chục ngàn dòng (Production), chuyển sang Debounced Server-side Search bằng cách gọi API kèm tham số `?keyword=...&page=...` sau mỗi 300ms. |
| **6** | **Folder Structure (Cấu trúc thư mục)** | **Feature & Layer Separation**: `components/` (common, layout), `pages/`, `services/`, `styles/`, `assets/`. | Code rõ ràng, module hóa cao, tách biệt rành mạch giữa UI (Presentation), Business Logic (Validation/Events) và Data Layer (Mock/Storage). | Giúp dự án sẵn sàng mở rộng cho Assignment 2 / Final Project mà không cần tái cấu trúc lại từ đầu. Giảng viên yêu cầu mở file nào có thể định vị trong vòng dưới 10 giây. |

---

## Sơ đồ cây Component (Component Architecture Tree)

```text
App (Root Component: Quản lý Auth State, Active Tab, Hydration)
│
├── [Chưa Login] ──> LoginPage
│                      ├── AI Logo & Header
│                      ├── Form Controlled Inputs (Username, Password)
│                      ├── Validation Feedback Alerts
│                      └── Quick-Fill Test Buttons
│
└── [Đã Login]   ──> AdminLayout
                       ├── Sidebar
                       │     ├── AI Logo & Title
                       │     ├── Menu Items (Dashboard, Categories, News, Users, Settings)
                       │     └── Sign Out Button
                       ├── Header
                       │     ├── Current Page Title
                       │     ├── User Avatar & Role Badge (Admin / Staff)
                       │     └── Quick Logout Action
                       └── Content Area (Render phân hệ tương ứng)
                             ├── DashboardPage (Cards, Category Chart, Recent News)
                             ├── CategoryManagement (CRUD Table, Search, Modal, Confirm)
                             ├── NewsManagement (CRUD Table, Multi-filter, Modal, Confirm)
                             ├── UserManagement (CRUD Table, Role Badges, Modal, Confirm)
                             └── SettingsPage (Profile, Environment Info, Reset Mock Data)
```
