/** Скриншоты продукта для лендинга (/_blob/… в дизайне → public/images). */
export const productImages = {
  payroll: { src: "/images/product-payroll.png", width: 2880, height: 1894 },
  owner: { src: "/images/product-owner.png", width: 780, height: 1688 },
  payslip: { src: "/images/product-payslip.png", width: 780, height: 1688 },
} as const;

export type ProductImage = keyof typeof productImages;
