import type { SymptomGroup } from "@/types";

export const symptomGroups: SymptomGroup[] = [
  {
    id: "sg-xuong-khop",
    slug: "xuong-khop",
    name: "Xương khớp",
    description: "Mỏi gối, cứng khớp buổi sáng, đau nhức khi trời lạnh.",
    image: "/images/symptoms/xuong-khop.svg",
  },
  {
    id: "sg-mat-ngu",
    slug: "mat-ngu",
    name: "Mất ngủ",
    description: "Khó vào giấc, ngủ chập chờn, hay tỉnh giữa đêm.",
    image: "/images/symptoms/mat-ngu.svg",
  },
  {
    id: "sg-tieu-hoa",
    slug: "tieu-hoa",
    name: "Tiêu hóa",
    description: "Ăn kém, đầy bụng, khó tiêu, đại tiện thất thường.",
    image: "/images/symptoms/tieu-hoa.svg",
  },
  {
    id: "sg-duong-nhan",
    slug: "duong-nhan",
    name: "Dưỡng nhan",
    description: "Muốn bồi bổ khí huyết, chăm sóc sắc diện từ bên trong.",
    image: "/images/symptoms/duong-nhan.svg",
  },
  {
    id: "sg-boi-bo",
    slug: "boi-bo",
    name: "Bồi bổ cơ thể",
    description: "Mới ốm dậy, hay mệt mỏi, ăn uống kém, căng thẳng kéo dài.",
    image: "/images/symptoms/boi-bo.svg",
  },
];
