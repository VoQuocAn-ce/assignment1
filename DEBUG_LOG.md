# DEBUGGING LOG (NHẬT KÝ XỬ LÝ LỖI KỸ THUẬT)

> **Căn cứ**: Mục 6.1, 6.2 & 6.3 tài liệu hướng dẫn Assignment 01 SBA301.  
> **Quy trình chuẩn 5 bước**:
> 1. Mô tả triệu chứng quan sát được bằng mắt / console log.
> 2. Khoanh vùng component, event và state liên quan.
> 3. Kiểm tra dữ liệu đầu vào (props, state, selected item, form data).
> 4. Xác định điểm biến đổi (event handler, setter, pure function).
> 5. Áp dụng bản sửa tối thiểu (minimal patch) -> Chạy lại đúng test case -> Kiểm tra hồi quy (regression).

---

## Bảng nhật ký 3 lỗi thực tế và quy trình khắc phục (Section 6.3)

### Bug Log #1: Ô tìm kiếm bị crash (màn hình trắng) hoặc không tìm được khi bài viết thiếu trường mô tả/tags

- **Triệu chứng (Symptom)**: Khi người dùng gõ từ khóa tìm kiếm trong bảng News, nếu có bài viết cũ mà trường `tags` hoặc `description` là `undefined` hoặc `null`, ứng dụng ném lỗi đỏ trong console: `TypeError: Cannot read properties of undefined (reading 'toLowerCase')` và toàn bộ danh sách bị vỡ màn hình trắng.
- **Giả thuyết (Hypothesis)**: Hàm lọc `search()` đang gọi trực tiếp `.toLowerCase()` trên thuộc tính mà không kiểm tra xem thuộc tính đó có tồn tại hoặc là chuỗi hay không.
- **Cách kiểm tra (Inspection)**: Mở file `src/services/newsService.js`, đặt `console.log(item)` ngay bên trong hàm filter. Phát hiện bản ghi mock vừa thêm không có giá trị ở trường `tags`.
- **Nguyên nhân gốc rễ (Root Cause)**: Toán tử `item.tags.toLowerCase()` được gọi trực tiếp mà thiếu điều kiện guard clause `item.tags && item.tags.toLowerCase()`.
- **Cách khắc phục (Fix)**: Sử dụng optional chaining hoặc điều kiện an toàn:
  ```javascript
  (item.tags && item.tags.toLowerCase().includes(norm))
  ```
- **Kiểm thử lại (Retest)**: Thử nghiệm tìm kiếm với bài viết rỗng tags, bài viết đầy đủ tags và chuỗi ký tự đặc biệt -> Tìm kiếm hoạt động mượt mà, không còn ngoại lệ runtime.

---

### Bug Log #2: Modal Create vẫn giữ lại dữ liệu của lần Edit trước đó (State Pollution)

- **Triệu chứng (Symptom)**: Người dùng bấm "Edit" bài viết A để sửa thông tin, sau đó bấm "Cancel" đóng modal. Tiếp theo bấm nút "Publish Article" (Create) thì form không rỗng mà lại hiển thị sẵn tiêu đề và nội dung của bài viết A.
- **Giả thuyết (Hypothesis)**: State `formData` dùng chung giữa chế độ Create và Edit chưa được làm sạch (reset) khi chuyển đổi `modalMode` sang 'create'.
- **Cách kiểm tra (Inspection)**: Đặt log trong hàm `handleOpenCreate()`. Nhận thấy hàm chỉ thiết lập `setModalMode('create')` và `setIsModalOpen(true)` mà quên gọi `setFormData()` về giá trị khởi tạo rỗng ban đầu.
- **Nguyên nhân gốc rễ (Root Cause)**: Vòng đời state của form chưa được reset khi thay đổi hành vi giữa Create và Update.
- **Cách khắc phục (Fix)**: Cập nhật hàm `handleOpenCreate` để luôn thiết lập form về trạng thái rỗng và xóa sạch các lỗi validation cũ:
  ```javascript
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedNews(null);
    setFormData({
      title: '',
      content: '',
      categoryId: categories[0]?.id || '',
      createdBy: currentUser?.username || 'Admin',
      status: 1,
      tags: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };
  ```
- **Kiểm thử lại (Retest)**: Mở Edit bài viết A -> Hủy -> Mở Create -> Form hoàn toàn sạch sẽ, không còn dữ liệu sót lại.

---

### Bug Log #3: Xóa nhầm Category làm hỏng toàn vẹn dữ liệu bài viết (Foreign Key Constraint Violation)

- **Triệu chứng (Symptom)**: Khi xóa danh mục "Technology" (ID: 1), sau đó vào phân hệ News Management thì các bài viết thuộc danh mục này hiển thị Category là "Unknown" hoặc bảng bị lỗi hiển thị tên.
- **Giả thuyết (Hypothesis)**: Hàm `categoryService.delete()` xóa trực tiếp ID mà không kiểm tra xem có bài viết nào trong hệ thống đang tham chiếu tới `categoryId` này hay không (vi phạm tính toàn vẹn dữ liệu).
- **Cách kiểm tra (Inspection)**: Mở `categoryService.js`. Phát hiện logic chỉ đơn thuần lọc `list.filter(item => item.id !== targetId)` mà không kiểm tra mảng `newsList`.
- **Nguyên nhân gốc rễ (Root Cause)**: Thiếu chính sách khóa ngoại (Referential Integrity Check) trước khi thực hiện thao tác xóa danh mục cha.
- **Cách khắc phục (Fix)**: Bổ sung bước kiểm tra ràng buộc trước khi xóa trong `categoryService.js`:
  ```javascript
  const newsList = loadStorage(STORAGE_KEYS.NEWS, []);
  const inUse = newsList.some(n => Number(n.categoryId) === targetId);
  if (inUse) {
    throw new Error('Cannot delete this category because it is currently assigned to one or more news articles. Please reassign or delete the news first.');
  }
  ```
- **Kiểm thử lại (Retest)**: Thử xóa danh mục "Technology" đang có bài viết -> Hệ thống hiện thông báo đỏ từ chối xóa và yêu cầu xử lý các bài viết trước; thử xóa danh mục trống chưa có bài viết nào -> Xóa thành công.
