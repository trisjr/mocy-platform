import { FREE_SHIPPING_THRESHOLD, SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { Faq } from "@/types";

/** Câu trả lời là copy mẫu cho bản demo, các con số cần phòng khám xác nhận. */
export const faqs: Faq[] = [
  {
    id: "tu-van-online",
    question: "Tư vấn online không bắt mạch trực tiếp thì lương y chẩn đoán thế nào?",
    answer:
      "Qua cuộc gọi video, lương y quan sát sắc mặt, lưỡi, hỏi kỹ triệu chứng, giấc ngủ, ăn uống, bệnh sử và xem kết quả xét nghiệm hoặc đơn thuốc cũ nếu anh/chị có. Trường hợp cần bắt mạch để phân biệt thể bệnh, lương y sẽ hẹn anh/chị khám trực tiếp trước khi bốc thuốc.",
  },
  {
    id: "sac-san",
    question: "Nhà thuốc có hỗ trợ sắc thuốc sẵn đóng túi không?",
    answer: `Có. Thuốc được sắc bằng nồi sắc kín, đóng túi hút chân không, mỗi túi một lần uống. Thuốc sắc sẵn bảo quản ngăn mát tủ lạnh và dùng trong 7 ngày. Anh/chị báo khi lương y tư vấn, hoặc gọi/nhắn Zalo ${SITE.hotline}. Phí sắc ghi ở khối Chi phí trên trang Đặt lịch.`,
  },
  {
    id: "bao-quan",
    question: "Thuốc thang và dược liệu giao đi tỉnh có bị ẩm mốc không, bảo quản ra sao?",
    answer: `Dược liệu được sấy lại trước khi đóng túi zip kèm gói hút ẩm; thuốc sắc sẵn đóng thùng xốp. Khi nhận, anh/chị để thuốc thang nơi khô ráo, tránh nắng, còn thuốc sắc sẵn cho ngay vào ngăn mát. Nếu hàng bị ẩm mốc hoặc hư hỏng khi nhận, anh/chị chụp ảnh và gọi ${SITE.hotline} để được đổi. Miễn phí giao hàng cho đơn từ ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`,
  },
  {
    id: "thuoc-tay",
    question: "Đang uống thuốc Tây có dùng kèm thuốc Đông y được không?",
    answer:
      "Nhiều trường hợp dùng kèm được, nhưng cần báo cho lương y mọi thuốc đang dùng để được hướng dẫn thời điểm uống cách xa nhau. Người đang điều trị bệnh mạn tính (huyết áp, tiểu đường, tim mạch…) không tự ý ngưng thuốc Tây, và nên hỏi bác sĩ điều trị trước khi kết hợp.",
  },
  {
    id: "lieu-trinh",
    question: "Một liệu trình thường kéo dài bao lâu và chi phí khoảng bao nhiêu?",
    answer:
      "Tùy thể bệnh và cơ địa, một liệu trình thường từ 2 đến 4 tuần, tái khám sau mỗi 7–10 ngày để gia giảm. Giá thang thuốc được báo trước khi bốc, thường khoảng 120.000–250.000đ/thang (mẫu); anh/chị đồng ý thì nhà thuốc mới bốc.",
  },
  {
    id: "doi-lich",
    question: "Muốn đổi giờ hoặc hủy lịch hẹn đã đặt thì làm thế nào?",
    answer: `Anh/chị gọi hoặc nhắn Zalo ${SITE.hotline}, đọc mã lịch hẹn in trên phiếu xác nhận, trước giờ hẹn ít nhất 2 tiếng. Nhân viên sẽ đổi sang khung giờ còn trống hoặc hủy lịch giúp anh/chị.`,
  },
];
