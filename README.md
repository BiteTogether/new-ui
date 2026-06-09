# BiteTogether

BiteTogether là một ứng dụng di động xây dựng bằng Expo + React Native, tập trung vào trải nghiệm kết nối quanh ăn uống: đăng nhập bằng số điện thoại, xem bài viết theo vị trí, nhắn tin realtime, tạo nhóm chat, chia sẻ vị trí, và xử lý các phiên vote / chia bill ngay trong chat.

## Tính năng chính

- Đăng nhập / đăng ký bằng số điện thoại và OTP.
- News feed theo khu vực, hỗ trợ đăng bài kèm ảnh và vị trí.
- Tìm kiếm, lưu bài viết và xem chi tiết bài viết.
- Chat 1-1 và chat nhóm realtime qua WebSocket.
- Tạo nhóm chat, thêm thành viên, xem chi tiết nhóm.
- Chia sẻ vị trí trong chat và xem vị trí thành viên.
- Tạo vote, xem kết quả vote, tạo bill, xác nhận thanh toán và xem kết quả bill.
- Hồ sơ cá nhân, cài đặt tài khoản và cài đặt hệ thống.
- Đa ngôn ngữ với tiếng Anh và tiếng Việt.
- Tích hợp Firebase cho Authentication, Analytics, Crashlytics, Messaging.

## Công nghệ sử dụng

- Expo
- React Native
- TypeScript
- Redux Toolkit
- React Navigation
- WebSocket realtime
- Firebase
- i18next
- React Native Maps
- Expo Image Picker, Location, Secure Store, Clipboard, File System

## Yêu cầu môi trường

- Node.js và Yarn
- Expo CLI
- Xcode trên macOS nếu chạy iOS
- Android Studio nếu chạy Android
- Tài khoản và cấu hình Firebase hợp lệ
- API key cho Google Maps / Vietmap nếu backend hoặc bản build của bạn cần

## Cài đặt

```bash
yarn install
```

Nếu bạn chạy iOS lần đầu, cài Pods trước:

```bash
npx pod-install
```

## Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc dự án và khai báo các biến mà app đang sử dụng:

```env
EXPO_PUBLIC_BASE_URL=
EXPO_PUBLIC_CHAT_SOCKET_URL=
EXPO_PUBLIC_VIETMAP_API_KEY=
ANDROID_GOOGLE_MAPS_API_KEY=
IOS_GOOGLE_MAPS_API_KEY=
GOOGLE_SERVICES_JSON=
GOOGLE_SERVICE_INFO_PLIST=
```

Ghi chú:

- `EXPO_PUBLIC_BASE_URL` là base URL cho REST API.
- `EXPO_PUBLIC_CHAT_SOCKET_URL` là endpoint WebSocket cho chat realtime.
- `EXPO_PUBLIC_VIETMAP_API_KEY` dùng cho tìm kiếm địa điểm / nhà hàng.
- `ANDROID_GOOGLE_MAPS_API_KEY` và `IOS_GOOGLE_MAPS_API_KEY` dùng cho bản đồ.
- `GOOGLE_SERVICES_JSON` và `GOOGLE_SERVICE_INFO_PLIST` là đường dẫn tùy chọn nếu bạn muốn override file Firebase khi build.

## Chạy ứng dụng

```bash
yarn start
```

Từ đó bạn có thể chạy thêm:

```bash
yarn android
yarn ios
yarn web
```

## Cấu trúc dự án

- `App.tsx`: root component, bọc Redux, Safe Area, gesture handler và toast.
- `src/navigation`: điều hướng chính của app.
- `src/screens`: các màn hình Authentication, Feed, Chat, Profile, Settings, Friends, Search.
- `src/components`: các component dùng lại như input, modal, top bar, loading.
- `src/store`: Redux store, slices và async actions.
- `src/services`: API client, WebSocket và các service tích hợp.
- `src/hooks`: custom hooks cho notification, websocket và logic dùng lại.
- `src/locales`: nội dung đa ngôn ngữ.
- `assets`: icon và tài nguyên tĩnh.

## Ghi chú triển khai

- Ứng dụng dùng Firebase Cloud Messaging và Crashlytics, nên cần cấu hình Firebase đúng cho từng nền tảng.
- App đang tối ưu cho mobile; web chỉ là chế độ chạy bổ sung của Expo.
- Nếu bạn thay đổi file cấu hình native, hãy đảm bảo đồng bộ lại với build của Expo / EAS.

## License

Chưa được khai báo.
