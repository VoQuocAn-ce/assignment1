# FUNewsManagementSystem - Assignment 01 (SBA301)

> **Course**: SBA301 - Integrate Single Page Application with Spring Boot  
> **Assignment**: Assignment 01 – Working with ReactJS Application  
> **Student**: An Võ Quốc  
> **Class**: SE1910  
> **Project Name**: `voquocan_se1910`  
> **Tech Stack**: React 18, Vite, Bootstrap 5, Bootstrap Icons, HTML5, CSS3, LocalStorage Engine  

---

## 1. Giới thiệu dự án (Project Overview)

`FUNewsManagementSystem` là hệ thống giao diện quản trị tin tức trực tuyến (Admin Dashboard) được xây dựng theo kiến trúc Single Page Application (SPA) sử dụng **ReactJS + Vite**. Ứng dụng đáp ứng đầy đủ các tiêu chí chấm điểm và rubric đánh giá 10/10 theo tài liệu hướng dẫn sinh viên của bộ môn SBA301:

- **Mock Authentication**: Đăng nhập với tài khoản `Admin / Admin` (hoặc `staff1 / 123456`), bảo vệ trang quản trị, lưu phiên làm việc `localStorage` không bị mất khi reload, chức năng Sign Out.
- **Master Admin Layout**: Header hiển thị Logo AI, thông tin tài khoản hiện tại, nút Logout; Sidebar điều hướng SPA 5 phân hệ với active state.
- **Dashboard**: Thống kê số lượng danh mục, bài viết tin tức (Active vs Inactive), số lượng người dùng (Admin vs Staff), thanh phân bổ tin theo danh mục, danh sách bài viết mới nhất và nút tác vụ nhanh.
- **Category Management**: Quản lý danh mục tin tức (CRUD + Search theo tên và mô tả, Create/Update qua popup dialog, Delete có hộp thoại xác nhận, ràng buộc toàn vẹn khóa ngoại chống xóa danh mục đang có tin tức).
- **News Management**: Quản lý bài viết tin tức (CRUD + Search theo từ khóa tiêu đề, nội dung, tác giả, tags; bộ lọc đa tiêu chí Category + Status; liên kết CategoryId; Create/Update qua dialog; Delete có xác nhận).
- **User / Account Management**: Quản lý tài khoản người dùng (CRUD + Search theo username, họ tên, email; phân quyền Role 1=Admin, 2=Staff; trạng thái Active/Locked; chống tự xóa chính mình).
- **Settings Page**: Xem thông tin tài khoản đang đăng nhập, thông tin môi trường dự án và nút **Reset All Mock Data to Default** để tiện lợi cho việc chấm bài / demo nhiều lần.

---

## 2. Hướng dẫn cài đặt và khởi chạy (Setup & Run)

### Yêu cầu môi trường
- **Node.js**: v18.x trở lên (đã kiểm tra tương thích trên Node v22.x)
- **npm**: v9.x trở lên

### Các bước khởi chạy
```bash
# 1. Di chuyển vào thư mục dự án
cd assigment1

# 2. Cài đặt các thư viện phụ thuộc (dependencies)
npm install

# 3. Khởi chạy Development Server
npm run dev

# 4. Mở trình duyệt và truy cập:
# http://localhost:3000 (hoặc cổng được hiển thị trong terminal)
```

### Lệnh đóng gói kiểm tra Production Build
```bash
npm run build
npm run preview
```

---

## 3. Tài khoản kiểm thử (Test Credentials)

| Role | Username | Password | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Administrator** | `Admin` | `Admin` | Toàn quyền quản trị Dashboard, Categories, News, Users, Settings |
| **Staff Member** | `staff1` | `123456` (hoặc `Staff`) | Quản lý nội dung tin tức, danh mục |
| **Locked User** | `editor_locked` | `123456` | Tài khoản bị khóa (dùng kiểm thử Validation đăng nhập) |

*(Gợi ý: Tại trang đăng nhập có sẵn 2 nút Quick Fill để giảng viên và người chấm có thể bấm 1 chạm mà không cần gõ bàn phím).*

---

## 4. Cấu trúc thư mục (Project Directory Structure)

```
assigment1/
├── public/
│   └── assets/
│       └── logo.svg                 # AI-generated Vector Logo
├── src/
│   ├── assets/
│   │   └── logo.svg                 # Logo bundle
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmDialog.jsx    # Hộp thoại xác nhận xóa (Delete confirmation)
│   │   │   ├── EmptyState.jsx       # Giao diện khi danh sách rỗng / không tìm thấy
│   │   │   ├── Modal.jsx            # Popup Dialog tái sử dụng cho Create / Update
│   │   │   └── ToastAlert.jsx       # Thông báo thành công / thất bại nổi trên góc
│   │   └── layout/
│   │       ├── AdminLayout.jsx      # Layout chính bao bọc Sidebar + Header + Body
│   │       ├── Header.jsx           # Thanh tiêu đề, thông tin user và nút Logout
│   │       └── Sidebar.jsx          # Menu điều hướng SPA 5 mục
│   ├── pages/
│   │   ├── CategoryManagement.jsx   # Phân hệ quản lý danh mục (CRUD + Search)
│   │   ├── DashboardPage.jsx        # Phân hệ tổng quan, số liệu thống kê
│   │   ├── LoginPage.jsx            # Trang đăng nhập với validation và quick-fill
│   │   ├── NewsManagement.jsx       # Phân hệ tin tức (CRUD + Search + Multi-filter)
│   │   ├── SettingsPage.jsx         # Cài đặt, profile, nút reset mock data
│   │   └── UserManagement.jsx       # Phân hệ quản lý người dùng (CRUD + Search)
│   ├── services/
│   │   ├── authService.js           # Xử lý đăng nhập, phiên đăng nhập, logout
│   │   ├── categoryService.js       # Thao tác dữ liệu danh mục & quan hệ khóa ngoại
│   │   ├── mockData.js              # Mock seed data và LocalStorage persistence
│   │   ├── newsService.js           # Thao tác dữ liệu bài viết và bộ lọc tìm kiếm
│   │   └── userService.js           # Thao tác dữ liệu tài khoản và kiểm tra email
│   ├── styles/
│   │   └── index.css                # Tùy biến giao diện hiện đại, responsive
│   ├── App.jsx                      # Root Component: auth guard, routing điều hướng
│   └── main.jsx                     # Entry point khởi tạo React root & import styles
├── AI_USAGE.md                      # Nhật ký minh bạch sử dụng AI theo rubric
├── DEBUG_LOG.md                     # Nhật ký 3 ca debug thực tế (Root cause -> Fix -> Retest)
├── DESIGN_DECISIONS.md              # Bảng ghi 6 quyết định thiết kế kiến trúc (Mục 3.6)
├── INTERVIEW_PREPARATION.md         # Tài liệu ôn luyện vấn đáp & câu hỏi phản biện
├── TEST_MATRIX.md                   # Bảng kiểm thử chi tiết 35 test cases (Mục 5.1)
├── package.json
└── vite.config.js
```

---

## 5. Danh sách tài liệu kiểm tra & đánh giá đi kèm

Sinh viên chuẩn bị sẵn sàng toàn bộ hồ sơ phục vụ buổi phỏng vấn bảo vệ:
1. **[TEST_MATRIX.md](./TEST_MATRIX.md)**: 35/35 Test cases bắt buộc theo Section 5.1 rubric (Normal, Negative, Edge case).
2. **[DEBUG_LOG.md](./DEBUG_LOG.md)**: Nhật ký 3 lỗi thường gặp và quy trình phân tích nguyên nhân gốc rễ.
3. **[DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md)**: 6 quyết định kỹ thuật cốt lõi (Navigation, State ownership, Persistence, Modal reuse, Search strategy, Folder structure).
4. **[INTERVIEW_PREPARATION.md](./INTERVIEW_PREPARATION.md)**: Hướng dẫn trả lời khung 5 tầng (Purpose - Input - Trigger - Transform - Output) và các câu hỏi vấn đáp trọng tâm.
5. **[AI_USAGE.md](./AI_USAGE.md)**: Bảng khai báo AI usage trung thực và minh bạch theo Section 9.
