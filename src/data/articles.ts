import type { Article } from "@/types";

export const articles: Article[] = [
  {
    id: "a-ngu-ngon-theo-dong-y",
    slug: "ngu-ngon-theo-dong-y-thoi-quen-va-vi-thuoc",
    title: "Ngủ ngon theo Đông y: thói quen buổi tối và những vị thuốc quen thuộc",
    excerpt:
      "Giấc ngủ chập chờn thường gắn với nếp sinh hoạt. Bài viết gợi ý thói quen buổi tối và giới thiệu vài vị dược liệu mà y học cổ truyền hay dùng cho người khó ngủ.",
    coverImage: "/images/articles/bi-quyet-ngu-ngon.svg",
    author: "Ban biên tập Mộc Y",
    reviewedByDoctorId: "doc-tran-thi-mai",
    publishedAt: "2026-10-18T08:00:00.000Z",
    readingMinutes: 6,
    symptomGroupIds: ["sg-mat-ngu"],
    content: [
      {
        type: "paragraph",
        text: "Nhiều người trung niên than ngủ không sâu: nằm mãi mới vào giấc, hay tỉnh lúc 2–3 giờ sáng, dậy vẫn thấy mệt. Y học hiện đại và y học cổ truyền đều cho rằng giấc ngủ chịu ảnh hưởng của nhiều yếu tố, trong đó có căng thẳng, giờ giấc sinh hoạt và ăn uống.",
      },
      { type: "heading", text: "Góc nhìn của y học cổ truyền" },
      {
        type: "paragraph",
        text: "Theo y học cổ truyền, giấc ngủ liên quan đến tâm (thần chí) và can (khí cơ). Khi suy nghĩ nhiều, lo lắng kéo dài, tâm thần được cho là khó yên nên ngủ không sâu. Vì vậy cách tiếp cận thường kết hợp nghỉ ngơi, điều chỉnh sinh hoạt và dùng dược liệu theo thể trạng từng người.",
      },
      { type: "heading", text: "Năm thói quen buổi tối nên thử" },
      {
        type: "list",
        items: [
          "Đi ngủ và thức dậy cùng một giờ mỗi ngày, kể cả cuối tuần.",
          "Ăn tối trước giờ ngủ ít nhất 2–3 tiếng, tránh bữa quá no hoặc nhiều dầu mỡ.",
          "Không dùng cà phê, trà đặc sau 14 giờ; hạn chế rượu bia vào buổi tối.",
          "Ngâm chân nước ấm 10–15 phút, tắt điện thoại và ti vi trước khi ngủ 30–60 phút.",
          "Dành vài phút hít thở chậm, xoa nhẹ lòng bàn chân để thư giãn.",
        ],
      },
      { type: "heading", text: "Một số vị dược liệu thường gặp" },
      {
        type: "paragraph",
        text: "Táo nhân, hạt sen, tâm sen, lạc tiên là những nguyên liệu quen thuộc trong dân gian và trong các bài thuốc dành cho người ngủ kém. Công dụng có thể khác nhau tùy cơ địa, vì vậy nên dùng đúng liều và nên hỏi ý kiến lương y nếu bạn đang dùng thuốc khác.",
      },
      {
        type: "products",
        title: "Sản phẩm liên quan đến giấc ngủ",
        productIds: ["p-tra-ngu-ngon", "p-tao-nhan-sao", "p-hat-sen-kho"],
      },
      {
        type: "quote",
        text: "Dược liệu chỉ là một phần. Giờ giấc đều đặn và tâm thế thư thả vào buổi tối thường quan trọng không kém.",
      },
      { type: "heading", text: "Khi nào nên đi khám" },
      {
        type: "paragraph",
        text: "Nếu mất ngủ kéo dài trên 2 tuần, kèm đau ngực, hồi hộp nhiều, sụt cân hoặc ảnh hưởng rõ đến công việc, bạn nên đến cơ sở y tế để được thăm khám. Thực phẩm bảo vệ sức khỏe không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.",
      },
      {
        type: "booking-cta",
        text: "Muốn được tư vấn theo thể trạng riêng? Đặt lịch trò chuyện cùng bác sĩ Trần Thị Mai.",
        doctorId: "doc-tran-thi-mai",
      },
    ],
    relatedProductIds: ["p-combo-ngu-ngon", "p-bai-thuoc-an-than", "p-tra-ngu-ngon"],
  },
  {
    id: "a-xuong-khop-mua-lanh",
    slug: "cham-soc-xuong-khop-khi-troi-lanh",
    title: "Chăm sóc xương khớp khi trời lạnh: vận động, giữ ấm và xoa bóp đúng cách",
    excerpt:
      "Trời chuyển lạnh, nhiều người lớn tuổi thấy đầu gối, lưng mỏi và cứng hơn. Một vài thói quen đơn giản có thể giúp bạn thoải mái hơn mỗi ngày.",
    coverImage: "/images/articles/xuong-khop-mua-lanh.svg",
    author: "Ban biên tập Mộc Y",
    reviewedByDoctorId: "doc-nguyen-van-an",
    publishedAt: "2026-10-30T08:00:00.000Z",
    readingMinutes: 5,
    symptomGroupIds: ["sg-xuong-khop"],
    content: [
      {
        type: "paragraph",
        text: "Khi nhiệt độ giảm, cơ và khớp dễ co cứng, người có tuổi thường cảm thấy mỏi gối, cứng khớp buổi sáng rõ hơn. Đây là trải nghiệm khá phổ biến, nhưng nếu khớp sưng nóng đỏ hoặc đau tăng nhanh, bạn nên đi khám sớm.",
      },
      { type: "heading", text: "Giữ ấm là bước đầu tiên" },
      {
        type: "list",
        items: [
          "Mặc đủ ấm vùng cổ, lưng và đầu gối, nhất là khi ra khỏi nhà sáng sớm.",
          "Tránh ngồi lâu dưới quạt hoặc điều hòa thổi trực tiếp vào khớp.",
          "Đi tất khi ngủ, dùng chăn nhẹ nhưng ấm.",
          "Uống đủ nước ấm trong ngày.",
        ],
      },
      { type: "heading", text: "Vận động nhẹ nhàng, đều đặn" },
      {
        type: "paragraph",
        text: "Đi bộ 20–30 phút, tập dưỡng sinh, bơi hoặc đạp xe nhẹ giúp khớp linh hoạt hơn. Hãy khởi động kỹ trước khi tập, tránh leo cầu thang nhiều và mang vác nặng. Nếu thấy đau tăng khi vận động, hãy dừng lại và hỏi ý kiến thầy thuốc.",
      },
      { type: "heading", text: "Xoa bóp ngoài da" },
      {
        type: "paragraph",
        text: "Xoa bóp vùng đau mỏi bằng cao hoặc dầu có tinh dầu ấm giúp da và cơ ấm lên, tạo cảm giác dễ chịu. Hãy xoa nhẹ theo vòng tròn 5–10 phút, không xoa mạnh lên vùng sưng đau, không bôi lên vết thương hở.",
      },
      {
        type: "products",
        title: "Sản phẩm dùng ngoài cho người hay đau mỏi",
        productIds: ["p-cao-xoa-bop-xuong-khop", "p-combo-xuong-khop"],
      },
      { type: "heading", text: "Bài thuốc thang cần lương y thăm khám" },
      {
        type: "paragraph",
        text: "Với người đau lâu ngày, y học cổ truyền thường xem xét thể trạng từng người (hàn, nhiệt, hư, thực) rồi mới gia giảm bài thuốc. Vì vậy, thuốc thang xương khớp cần được lương y tư vấn trước, không nên tự mua theo lời mách.",
      },
      {
        type: "booking-cta",
        text: "Bạn muốn được bắt mạch, tư vấn trực tiếp? Đặt lịch với Lương y Nguyễn Văn An.",
        doctorId: "doc-nguyen-van-an",
      },
    ],
    relatedProductIds: ["p-cao-xoa-bop-xuong-khop", "p-combo-xuong-khop", "p-bai-thuoc-xuong-khop"],
  },
  {
    id: "a-tieu-hoa-kien-ty",
    slug: "giu-ty-vi-khoe-moi-ngay",
    title: "Giữ tỳ vị khỏe mỗi ngày: ăn uống và vị thuốc kiện tỳ quen thuộc",
    excerpt:
      "Ăn kém, đầy bụng, đại tiện thất thường là nỗi phiền của nhiều người đi làm. Cùng tìm hiểu cách ăn uống và vài nguyên liệu Đông y gần gũi.",
    coverImage: "/images/articles/tieu-hoa-kien-ty.svg",
    author: "Ban biên tập Mộc Y",
    reviewedByDoctorId: "doc-le-quang-hoa",
    publishedAt: "2026-11-08T08:00:00.000Z",
    readingMinutes: 5,
    symptomGroupIds: ["sg-tieu-hoa", "sg-boi-bo"],
    content: [
      {
        type: "paragraph",
        text: "Trong y học cổ truyền, tỳ vị được ví như \"kho lương thực\" của cơ thể: nơi tiếp nhận và chuyển hóa thức ăn. Khi ăn uống thất thường, ăn quá nhanh, nhiều đồ lạnh hoặc căng thẳng kéo dài, người ta thường thấy đầy bụng, ăn không ngon miệng.",
      },
      { type: "heading", text: "Nguyên tắc ăn uống nhẹ nhàng cho tỳ vị" },
      {
        type: "list",
        items: [
          "Ăn chậm, nhai kỹ, ăn đúng giờ, không bỏ bữa sáng.",
          "Ưu tiên món ấm, nấu chín mềm như cháo, canh, súp; hạn chế đồ sống lạnh.",
          "Không ăn quá no vào buổi tối, không nằm ngay sau bữa ăn.",
          "Giảm đồ chiên rán, nhiều dầu mỡ, hạn chế rượu bia.",
          "Đi bộ nhẹ 15 phút sau bữa ăn.",
        ],
      },
      { type: "heading", text: "Nguyên liệu quen thuộc trong bếp Đông y" },
      {
        type: "paragraph",
        text: "Hoài sơn (củ mài), hạt sen thường được hầm xương hoặc nấu cháo cho người ăn kém, mới ốm dậy. Trần bì, sơn tra, gừng hay được dùng pha trà sau bữa ăn nhiều đạm. Mỗi người có thể có phản ứng khác nhau, nên bắt đầu với lượng nhỏ và theo dõi cơ thể.",
      },
      {
        type: "products",
        title: "Gợi ý cho người ăn kém, đầy bụng",
        productIds: ["p-hoai-son-thai-lat", "p-hat-sen-kho", "p-tra-tieu-thuc"],
      },
      { type: "heading", text: "Dấu hiệu cần đi khám" },
      {
        type: "paragraph",
        text: "Hãy đến cơ sở y tế nếu bạn đau bụng kéo dài, sụt cân không rõ nguyên nhân, nôn ra máu hoặc đi ngoài phân đen, ra máu. Dược liệu và thực phẩm bảo vệ sức khỏe không thay thế được việc thăm khám.",
      },
      {
        type: "booking-cta",
        text: "Cần tư vấn thể trạng tỳ vị? Đặt lịch tư vấn trực tuyến buổi tối với Lương y Lê Quang Hòa.",
        doctorId: "doc-le-quang-hoa",
      },
    ],
    relatedProductIds: ["p-bai-thuoc-kien-ty", "p-hoai-son-thai-lat", "p-tra-tieu-thuc"],
  },
  {
    id: "a-duong-nhan-tu-ben-trong",
    slug: "duong-nhan-tu-ben-trong-voi-tra-thao-moc",
    title: "Dưỡng nhan từ bên trong: nếp sinh hoạt và trà thảo mộc dễ uống mỗi ngày",
    excerpt:
      "Sắc diện phản ánh phần nào giấc ngủ, ăn uống và tinh thần. Bài viết gợi ý cách chăm sóc nhẹ nhàng, kèm vài nguyên liệu thảo mộc dễ tìm.",
    coverImage: "/images/articles/duong-nhan-tu-ben-trong.svg",
    author: "Ban biên tập Mộc Y",
    reviewedByDoctorId: "doc-tran-thi-mai",
    publishedAt: "2026-11-15T08:00:00.000Z",
    readingMinutes: 4,
    symptomGroupIds: ["sg-duong-nhan", "sg-boi-bo"],
    content: [
      {
        type: "paragraph",
        text: "Làn da, mái tóc và thần sắc thường thay đổi theo giấc ngủ, chế độ ăn và mức độ căng thẳng. Y học cổ truyền gọi đó là khí huyết đầy đủ và lưu thông. Dưỡng nhan vì vậy bắt đầu từ lối sống, rồi mới đến sản phẩm hỗ trợ.",
      },
      { type: "heading", text: "Ba nền tảng của sắc diện tươi tắn" },
      {
        type: "list",
        items: [
          "Ngủ đủ 7–8 tiếng, đi ngủ trước 23 giờ.",
          "Uống đủ nước, ăn nhiều rau xanh, trái cây, hạn chế đồ ngọt và đồ chiên.",
          "Vận động đều đặn, giữ tinh thần thoải mái.",
        ],
      },
      { type: "heading", text: "Nguyên liệu thảo mộc quen thuộc" },
      {
        type: "paragraph",
        text: "Kỷ tử, táo đỏ, hoa cúc, hoa hồng thường được dùng pha trà, có vị ngọt nhẹ và dễ uống. Đương quy thường nằm trong các bài thuốc bổ huyết nhưng cần dùng đúng chỉ dẫn, và không dùng cho phụ nữ có thai. Hiệu quả của mỗi người có thể khác nhau.",
      },
      {
        type: "products",
        title: "Gợi ý cho người muốn chăm sóc từ bên trong",
        productIds: ["p-tra-duong-nhan", "p-ky-tu-ninh-ha", "p-duong-quy-thai-lat"],
      },
      {
        type: "quote",
        text: "Trà thảo mộc là một thói quen tốt, không phải phép màu. Kiên trì và điều độ mới là điều tạo nên khác biệt.",
      },
      {
        type: "booking-cta",
        text: "Muốn biết thể trạng của mình hợp với nguyên liệu nào? Đặt lịch tư vấn với Bác sĩ Trần Thị Mai.",
        doctorId: "doc-tran-thi-mai",
      },
    ],
    relatedProductIds: ["p-combo-duong-nhan", "p-tra-duong-nhan", "p-ky-tu-ninh-ha"],
  },
];
