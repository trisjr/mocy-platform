import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "t-01",
    name: "Cô Phạm Thị Lan",
    age: 58,
    location: "Cầu Giấy, Hà Nội",
    content:
      "Tôi uống trà ngủ ngon mỗi tối kèm ngâm chân nước ấm, thấy dễ vào giấc hơn trước. Hộp đóng gói gọn, vị thanh dễ uống. Mỗi người một cơ địa nên tôi vẫn hỏi lại bác sĩ Mai khi dùng thêm thuốc.",
    rating: 5,
    productId: "p-tra-ngu-ngon",
    doctorId: "doc-tran-thi-mai",
  },
  {
    id: "t-02",
    name: "Chú Nguyễn Văn Hải",
    age: 64,
    location: "Thanh Xuân, Hà Nội",
    content:
      "Trời lạnh là đầu gối nhà tôi mỏi nhiều. Tôi xoa cao buổi tối trước khi ngủ, thấy ấm và dễ chịu. Lương y An dặn rất kỹ cách dùng và bảo nếu sưng đau nhiều thì phải đi khám ngay.",
    rating: 5,
    productId: "p-cao-xoa-bop-xuong-khop",
    doctorId: "doc-nguyen-van-an",
  },
  {
    id: "t-03",
    name: "Chị Đỗ Minh Thu",
    age: 41,
    location: "Quận 3, TP. Hồ Chí Minh",
    content:
      "Tôi làm văn phòng, hay quên uống nước. Trà dưỡng nhan vị ngọt nhẹ nên tôi uống đều hơn. Giao hàng nhanh, có đầy đủ số công bố trên hộp, tôi thấy yên tâm.",
    rating: 4,
    productId: "p-tra-duong-nhan",
  },
  {
    id: "t-04",
    name: "Bác Trần Quốc Bảo",
    age: 67,
    location: "Hải Phòng",
    content:
      "Tôi đặt lịch tư vấn qua Zalo cho tiện, khỏi đi xa. Lương y Hòa hỏi kỹ chuyện ăn uống rồi gợi ý món hầm hoài sơn. Nhân viên gọi lại báo giá bài thuốc rất rõ ràng.",
    rating: 5,
    productId: "p-bai-thuoc-kien-ty",
    doctorId: "doc-le-quang-hoa",
  },
  {
    id: "t-05",
    name: "Anh Lê Hoàng Nam",
    age: 36,
    location: "Hải Châu, Đà Nẵng",
    content:
      "Dạo này công việc nhiều, tôi mua combo ngủ ngon 15 ngày dùng thử. Kết hợp đi ngủ đúng giờ, tôi thấy nếp ngủ ổn định hơn. Hướng dẫn trong hộp dễ hiểu, không có chữ nào hứa hẹn quá đà.",
    rating: 4,
    productId: "p-combo-ngu-ngon",
  },
];
