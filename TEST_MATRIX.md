# TEST MATRIX (BẢNG KIỂM THỬ ĐÁNH GIÁ CHẤT LƯỢNG)

> **Căn cứ**: Mục 5.1 & 5.2 tài liệu hướng dẫn Assignment 01 SBA301.  
> **Phạm vi**: 35 Test Cases bao phủ đầy đủ 3 lớp kiểm thử: **Normal case (Happy path)**, **Negative case (Validation/Lỗi)** và **Edge case (Ranh giới/Ràng buộc)**.  
> **Người thực hiện**: An Võ Quốc - SE1910  
> **Kết quả đánh giá tổng thể**: 35/35 PASSED (100%)

---

## Bảng kết quả kiểm thử 35 Test Cases

| # | Nhóm chức năng | Test Case | Thao tác thực hiện (Action) | Kết quả mong đợi (Expected Result) | Thực tế & Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Login** | Empty Inputs | Để trống Username và Password, nhấn nút "Sign In". | Không cho đăng nhập; hiển thị viền đỏ và thông báo lỗi validation bắt buộc. | **PASS** |
| **2** | **Login** | Wrong Credential | Nhập Username: `Admin`, Password: `WrongPassword123`, nhấn "Sign In". | Không vào trang admin; hiển thị alert màu đỏ cảnh báo sai thông tin. | **PASS** |
| **3** | **Login** | Valid Admin | Nhập Username: `Admin`, Password: `Admin`, nhấn "Sign In". | Đăng nhập thành công; chuyển hướng sang Admin Dashboard ngay lập tức. | **PASS** |
| **4** | **Auth** | Logout | Nhấn nút "Logout" tại Header hoặc "Sign Out" tại Sidebar. | Xóa session trong storage; quay về màn hình đăng nhập; không truy cập được admin. | **PASS** |
| **5** | **Layout** | Menu Completeness | Quan sát cấu trúc thanh Sidebar bên trái. | Hiển thị đủ 5 phân hệ: Dashboard, Categories, News, Users, Settings. | **PASS** |
| **6** | **Navigation** | All Menus | Lần lượt click vào từng mục trong thanh Menu. | Chuyển đổi đúng nội dung trang tương ứng; không bị reload lại toàn bộ trang (chuẩn SPA). | **PASS** |
| **7** | **Category** | Read | Nhấp chọn menu "Categories". | Bảng danh sách tải ra đầy đủ dữ liệu (ID, Name, Description, Status, Actions). | **PASS** |
| **8** | **Category** | Create Valid | Mở popup "Add Category", điền Tên: "AI & Data Science", chọn Active, bấm Submit. | Modal đóng; Category mới xuất hiện trong danh sách; hiển thị toast thông báo thành công. | **PASS** |
| **9** | **Category** | Create Invalid | Mở popup "Add Category", xóa rỗng tên và bấm Submit. | Không cho tạo; hiển thị lỗi "Category name cannot be empty". | **PASS** |
| **10** | **Category** | Update | Bấm nút Edit (biểu tượng bút) tại dòng bất kỳ, sửa tên và bấm Save. | Modal đóng; dòng dữ liệu được cập nhật đúng bản ghi đó; toast thông báo thành công. | **PASS** |
| **11** | **Category** | Delete Cancel | Bấm nút Delete (thùng rác), hộp thoại xác nhận hiện ra, bấm "Cancel". | Hộp thoại đóng lại; bản ghi vẫn còn nguyên vẹn trong danh sách. | **PASS** |
| **12** | **Category** | Delete Confirm | Bấm nút Delete bản ghi không có ràng buộc, bấm "Confirm Delete". | Hộp thoại đóng; bản ghi biến mất khỏi bảng; dữ liệu cập nhật tức thì. | **PASS** |
| **13** | **Category** | Search Hit | Nhập từ khóa `Tech` vào thanh tìm kiếm danh mục. | Bảng lọc ra đúng bản ghi "Technology"; số lượng đếm hiển thị chính xác. | **PASS** |
| **14** | **Category** | Search Miss | Nhập từ khóa không tồn tại như `XYZ999`. | Hiển thị giao diện EmptyState "No categories matched" cùng nút "Clear Search". | **PASS** |
| **15** | **News** | Read | Nhấp chọn menu "News Articles". | Danh sách bài viết hiển thị đúng: Title, Category Badge, Author, Status, Date. | **PASS** |
| **16** | **News** | Create Valid | Bấm "Publish Article", điền Title, chọn Category, nhập Content, bấm Publish. | Bài viết mới xuất hiện ngay đầu danh sách; toast thông báo thành công. | **PASS** |
| **17** | **News** | Create Invalid | Bấm "Publish Article", để trống trường Title hoặc Content, bấm Publish. | Hiển thị viền đỏ validation tại các trường bắt buộc thiếu; không gửi dữ liệu. | **PASS** |
| **18** | **News** | Update | Bấm nút Edit tại một bài viết, đổi tiêu đề và bấm Save Changes. | Đúng bài viết đó được cập nhật; thông tin phản ánh ngay trên bảng. | **PASS** |
| **19** | **News** | Delete Cancel | Bấm nút Delete bài viết, hộp thoại mở ra, chọn "Cancel". | Hộp thoại đóng; bài viết được giữ nguyên không bị xóa. | **PASS** |
| **20** | **News** | Delete Confirm | Bấm nút Delete bài viết, chọn "Confirm Delete". | Bài viết bị xóa khỏi danh sách; toast thông báo xóa thành công. | **PASS** |
| **21** | **News** | Search Hit | Gõ từ khóa `React` vào ô tìm kiếm tin tức. | Bảng lọc đúng bài viết liên quan đến React; không ghi đè mất danh sách gốc. | **PASS** |
| **22** | **News** | Search Miss | Gõ từ khóa `NotFoundString404`. | Hiển thị EmptyState thân thiện "No matching news articles" kèm nút Reset. | **PASS** |
| **23** | **Users** | Read | Nhấp chọn menu "User Accounts". | Bảng tài khoản hiển thị đúng: Username, Họ tên, Email, Role, Status, Hành động. | **PASS** |
| **24** | **Users** | Create Valid | Bấm "Add User", điền `staff_nam`, Họ tên, Email hợp lệ, chọn Staff, bấm Submit. | Tài khoản mới được thêm thành công; role badge hiển thị màu tím (Staff). | **PASS** |
| **25** | **Users** | Create Invalid | Bấm "Add User", nhập email không đúng định dạng (`abc@@.com`), bấm Submit. | Hiển thị thông báo lỗi "Invalid email format". | **PASS** |
| **26** | **Users** | Update | Bấm nút Edit một user, cập nhật họ tên và bấm Save Changes. | Dòng tài khoản được cập nhật thông tin mới; username bị khóa cố định (read-only). | **PASS** |
| **27** | **Users** | Delete Cancel | Bấm nút Delete một user khác, chọn "Cancel" tại hộp thoại. | Hộp thoại đóng; tài khoản đó vẫn còn nguyên trong bảng. | **PASS** |
| **28** | **Users** | Delete Confirm | Bấm nút Delete một user, chọn "Confirm Delete". | Tài khoản bị xóa khỏi danh sách; toast thông báo thành công. | **PASS** |
| **29** | **Users** | Search Hit | Gõ `admin` hoặc `staff` vào ô tìm kiếm tài khoản. | Danh sách lọc chính xác các tài khoản có username, họ tên hoặc email chứa từ khóa. | **PASS** |
| **30** | **Users** | Search Miss | Gõ từ khóa không tồn tại vào ô tìm kiếm tài khoản. | Hiển thị EmptyState thông báo không tìm thấy kết quả. | **PASS** |
| **31** | **News Relation** | Category FK | Tạo bài viết mới và quan sát danh sách chọn danh mục. | Dropdown chỉ cho chọn từ các danh mục đang tồn tại; bài viết hiển thị đúng tên danh mục. | **PASS** |
| **32** | **User Role** | Role Mapping | Quan sát cột Role trong User Management và Header. | Role 1 hiển thị Badge đỏ `Administrator`; Role 2 hiển thị Badge tím `Staff`. | **PASS** |
| **33** | **Status Display**| Status Labels | Quan sát cột Status ở tất cả các bảng. | Giá trị 1 hiển thị nhãn xanh `Active`; giá trị 0 hiển thị nhãn xám `Inactive/Draft/Locked`. | **PASS** |
| **34** | **Data Edge Case**| Empty State | Xóa hết toàn bộ bài viết hoặc danh mục. | Ứng dụng không bị crash màn hình trắng; hiển thị EmptyState mời tạo mới. | **PASS** |
| **35** | **Persistence** | Page Reload | Đăng nhập, thêm 1 bài viết mới, sau đó nhấn F5 (Reload trình duyệt). | Ứng dụng giữ nguyên trạng thái đăng nhập; bài viết vừa thêm vẫn tồn tại nguyên vẹn. | **PASS** |
