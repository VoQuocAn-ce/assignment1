# TÀI LIỆU ÔN TẬP VẤN ĐÁP & BẢO VỆ CODE (INTERVIEW & DEFENSE PREPARATION)

> **Mục tiêu**: Giúp sinh viên nắm chắc 100% bản chất source code, tự tin chỉ đúng dòng code trong vòng 30 giây và trả lời lưu loát mọi câu hỏi của giảng viên theo khung chuẩn 5 tầng.

---

## 1. Khung trả lời chuẩn 5 tầng (5-Tier Explanation Framework)

Khi giảng viên chỉ định giải thích một file hoặc một component bất kỳ (ví dụ: `NewsManagement.jsx`, `LoginPage.jsx`):

1. **Purpose (Mục đích)**: *"Component này chịu trách nhiệm quản lý toàn bộ vòng đời của tin tức bao gồm hiển thị danh sách, tìm kiếm đa tiêu chí, mở modal thêm/sửa và xử lý xóa an toàn."*
2. **Input (Dữ liệu đầu vào)**: *"Dữ liệu đi vào component thông qua props `currentUser` (từ App truyền xuống) và danh sách `newsList`, `categories` được tải từ service layer (`newsService`, `categoryService`)."*
3. **Trigger (Sự kiện kích hoạt)**: *"Khi người dùng gõ phím vào ô tìm kiếm (`onChange`), chọn danh mục trong dropdown lọc, hoặc nhấn nút Submit form (`onSubmit`)."*
4. **Transform (Logic xử lý dữ liệu)**: *"Component thực hiện validate dữ liệu bắt buộc (title, content, categoryId), sau đó gọi hàm service tương ứng để thực hiện thao tác bất biến (immutable update) trên mảng."*
5. **Output (Dữ liệu đầu ra & Re-render)**: *"State `newsList` được cập nhật bằng setter function, kích hoạt React re-render lại bảng và hiển thị toast thông báo thành công cho người dùng mà không cần reload trang."*

---

## 2. Checklist "Mở file và chỉ code trong 30 giây" (Section 7.3)

| Yêu cầu của Giảng viên | File cần mở ngay | Dòng code / Vị trí giải thích |
| :--- | :--- | :--- |
| **1. Chỉ điều kiện đăng nhập Admin/Admin** | `src/services/authService.js` | Dòng kiểm tra: `trimmedUser.toLowerCase() === 'admin' && trimmedPass === 'Admin'` |
| **2. Nơi lưu trữ Auth state & Logout** | `src/App.jsx` & `src/services/authService.js` | `localStorage.getItem('fu_news_auth_session')` và hàm `handleLogout()` xóa storage rồi `setCurrentUser(null)` |
| **3. Logic Create & Update bất biến (Immutable)** | `src/pages/CategoryManagement.jsx` | `setCategories(prev => [...prev, created])` (thêm mới) và `setCategories(prev => prev.map(c => c.id === updated.id ? updated : c))` (cập nhật) |
| **4. Ràng buộc khóa ngoại News với Category** | `src/services/categoryService.js` | Dòng `newsList.some(n => Number(n.categoryId) === targetId)` chặn xóa khi category đang được dùng |
| **5. Phân quyền hiển thị Role (Admin/Staff)** | `src/pages/UserManagement.jsx` | Dòng `item.role === ROLE.ADMIN ? 'badge-admin' : 'badge-staff'` |
| **6. Hộp thoại xác nhận xóa (Delete Confirmation)** | `src/components/common/ConfirmDialog.jsx` | Modal popup hiển thị cảnh báo, nút Cancel không làm gì, nút Confirm gọi `onConfirm()` |
| **7. Logic tìm kiếm không làm mất mảng gốc** | `src/pages/NewsManagement.jsx` | Sử dụng `useMemo(() => newsService.search(newsList, searchKeyword, ...), [newsList, searchKeyword])` |
| **8. State điều khiển Modal Create/Update** | `src/pages/CategoryManagement.jsx` | State `isModalOpen`, `modalMode` ('create' \| 'edit') và `selectedCategory` |
| **9. Khởi tạo và Hydrate dữ liệu LocalStorage** | `src/services/mockData.js` | Hàm `loadStorage(key, fallback)` kiểm tra nếu chưa có dữ liệu trong storage thì nạp `fallback` ban đầu |

---

## 3. Câu hỏi lý thuyết React trọng tâm (React Fundamentals)

### Q1: Props và State khác nhau như thế nào?
- **Props**: Là tham số dữ liệu được truyền từ component cha xuống component con (tương tự như tham số truyền vào hàm). Props là **read-only (bất biến)** từ góc nhìn của component con; component con không được tự ý sửa đổi props.
- **State**: Là dữ liệu nội tại do chính component đó quản lý và có thể thay đổi theo thời gian thông qua hàm setter (ví dụ: `useState`). Khi state thay đổi, component sở hữu nó sẽ kích hoạt quá trình re-render.

### Q2: Vì sao tuyệt đối không được mutate trực tiếp state trong React?
- React so sánh state cũ và state mới dựa trên **tham chiếu bộ nhớ (shallow equality check / reference comparison)** `Object.is()`.
- Nếu ta dùng `array.push()` hoặc `object.title = '...'`, tham chiếu vùng nhớ của mảng/đối tượng không hề thay đổi. Do đó React sẽ coi như không có sự thay đổi nào xảy ra và **sẽ không kích hoạt re-render giao diện**, dẫn tới bug dữ liệu trên UI không được cập nhật.
- Luôn phải tạo bản sao mới (immutable) bằng Spread Operator: `[...prevList, newItem]` hoặc `.map()` / `.filter()`.

### Q3: Controlled Input là gì và tại sao lại sử dụng trong dự án?
- **Controlled Input** là input mà giá trị hiển thị của nó (`value`) được kiểm soát hoàn toàn bởi một React State, và mọi thao tác gõ phím của người dùng đều kích hoạt sự kiện `onChange` để cập nhật lại state đó.
- Lợi ích: Dễ dàng kiểm tra validation theo thời gian thực (real-time feedback), chuẩn hóa dữ liệu đầu vào (trim, format), vô hiệu hóa nút submit khi dữ liệu không hợp lệ.

### Q4: Vì sao khi render danh sách bằng hàm `map()` bắt buộc phải có thuộc tính `key`?
- Thuộc tính `key` cung cấp một định danh duy nhất và ổn định cho mỗi phần tử trong danh sách.
- Trong quá trình **Reconciliation (so khớp Virtual DOM)**, React dựa vào `key` để nhận biết chính xác phần tử nào vừa được thêm vào, bị xóa đi, hoặc thay đổi vị trí, từ đó chỉ cập nhật đúng các nút DOM thực tế đó thay vì phải dựng lại toàn bộ danh sách (tối ưu hóa hiệu năng).
- Không nên dùng `index` làm key nếu danh sách có thao tác thêm/xóa/sắp xếp vì index sẽ bị xáo trộn khi mảng thay đổi.

### Q5: Phương thức `e.preventDefault()` trong form submit dùng để làm gì?
- Mặc định của trình duyệt HTML khi submit một form là gửi một HTTP request và **tải lại toàn bộ trang web (full page reload)**.
- `e.preventDefault()` ngăn chặn hành vi mặc định đó, cho phép React tiếp quản sự kiện bằng JavaScript, thực hiện validate và gọi API/state một cách êm ái mà không làm gián đoạn trải nghiệm của Single Page Application (SPA).

---

## 4. Kịch bản giải quyết bài tập thay đổi (Transfer / Modification Tasks)

Trong buổi chấm, giảng viên có thể yêu cầu sinh viên thực hiện một thay đổi nhỏ trực tiếp (Section 8 Rubric). Dưới đây là các kịch bản mẫu và cách trả lời chuẩn kỹ sư:

### Kịch bản 1: "Thêm nút Reset Form trong Create/Update Dialog"
- **Phân tích tác động**: Yêu cầu chỉ ảnh hưởng đến file `src/pages/CategoryManagement.jsx` (hoặc `NewsManagement.jsx`) ở tầng UI form và không ảnh hưởng đến cấu trúc dữ liệu.
- **Cách làm**:
  1. Thêm một nút `<button type="button" className="btn btn-outline-warning" onClick={handleResetForm}>Reset</button>` vào footer của Modal.
  2. Viết hàm `handleResetForm`:
     - Nếu `modalMode === 'create'`: thiết lập lại `setFormData({ name: '', description: '', status: 1 })`.
     - Nếu `modalMode === 'edit'`: nạp lại đúng giá trị ban đầu từ `selectedCategory`.

### Kịch bản 2: "Thêm kiểm tra độ dài tiêu đề bài viết (tối thiểu 10 ký tự)"
- **Phân tích tác động**: Ảnh hưởng đến hàm `validateForm()` trong `NewsManagement.jsx`.
- **Cách làm**:
  ```javascript
  if (!formData.title.trim()) {
    errors.title = 'News title cannot be empty.';
  } else if (formData.title.trim().length < 10) {
    errors.title = 'News title must be at least 10 characters long.';
  }
  ```

### Kịch bản 3: "Sau này khi thay Mock Data bằng Spring Boot REST API thì cần sửa những gì?"
- **Cách trả lời chuẩn kiến trúc**:
  *"Nhờ kiến trúc dự án đã tách biệt rành mạch tầng Service (`src/services/`) khỏi các Component giao diện (`src/pages/`), khi tích hợp Spring Boot API thật, **toàn bộ giao diện UI của các trang và Modal không cần phải viết lại**. Chúng ta chỉ cần thay thế các hàm trong `categoryService.js`, `newsService.js` từ việc đọc/ghi LocalStorage thành các hàm bất đồng bộ (async/await) sử dụng `axios` hoặc `fetch` để gọi tới các Endpoint Spring Boot: `GET /api/categories`, `POST /api/news`, v.v."*
