/**
 * Nén ảnh người dùng chọn thành data URL JPEG nhỏ để lưu localStorage (chỉ để xem trước).
 * Mặc định cạnh dài tối đa 900px, chất lượng 0.7 (thường dưới 150 KB).
 * Chỉ chạy trên trình duyệt.
 */
export async function compressImage(file: File, maxSize = 900, quality = 0.7): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Không đọc được ảnh. Vui lòng chọn ảnh JPG hoặc PNG."));
      el.src = url;
    });
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}
