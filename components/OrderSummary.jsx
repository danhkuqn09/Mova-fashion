import React from 'react';

const OrderSummary = () => {
  // Dữ liệu giả lập
  const totalItems = 1;
  const subtotal = 385000; // VNĐ
  const shippingFee = 0;   // VNĐ

  return (
    <div className="w-full lg:w-1/2 p-4 lg:pl-10">
      <h3 className="text-xl font-semibold mb-6">Sản Phẩm</h3>
      <div className="space-y-3">
        {/* Chi tiết Sản Phẩm (giả định 1 sản phẩm) */}
        <div className="flex justify-between items-start text-sm pb-3 border-b border-gray-200">
          <p className="text-gray-600">
            Tên Sản Phẩm x {totalItems}
          </p>
          <p className="font-medium">{subtotal.toLocaleString('vi-VN')} VNĐ</p>
        </div>

        {/* Giỏ hàng */}
        <div className="flex justify-between text-sm">
          <p>Giỏ</p>
          <p>{subtotal.toLocaleString('vi-VN')} VNĐ</p>
        </div>

        {/* Phí Giao hàng (Giả sử miễn phí) */}
        <div className="flex justify-between text-sm">
          <p>Giao</p>
          <p>{shippingFee.toLocaleString('vi-VN')} VNĐ</p>
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-between pt-3 text-lg font-bold">
          <p>Tổng cộng</p>
          <p className="text-red-600">{(subtotal + shippingFee).toLocaleString('vi-VN')} VNĐ</p>
        </div>
      </div>

      {/* Nút Đặt Hàng */}
      <button
        className="w-full mt-8 py-3 text-white bg-black hover:bg-gray-800 transition duration-150 font-semibold uppercase tracking-wider text-sm border border-black"
      >
        Đặt Hàng
      </button>
    </div>
  );
};

export default OrderSummary;