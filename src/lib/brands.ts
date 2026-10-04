import type { Brand } from './types';

export const brands: Brand[] = [
  { slug: 'apple', name: 'Apple', blurb: 'iPhone, MacBook, iPad, Apple Watch and AirPods.' },
  { slug: 'samsung', name: 'Samsung', blurb: 'Galaxy phones, tablets, watches, TVs and soundbars.' },
  { slug: 'hp', name: 'HP', blurb: 'Business and student laptops, desktops and printers.' },
  { slug: 'lg', name: 'LG', blurb: 'OLED and UHD TVs, and UltraGear monitors.' },
  { slug: 'sony', name: 'Sony', blurb: 'Bravia TVs, noise-cancelling headphones and soundbars.' },
  { slug: 'dell', name: 'Dell', blurb: 'Latitude and Inspiron laptops, and office monitors.' },
  { slug: 'lenovo', name: 'Lenovo', blurb: 'ThinkPad business laptops and Lenovo tablets.' },
  { slug: 'tecno', name: 'Tecno', blurb: 'Camon and Spark smartphones built for Africa.' },
  { slug: 'infinix', name: 'Infinix', blurb: 'Note and Hot series phones with fast charging.' },
  { slug: 'xiaomi', name: 'Xiaomi', blurb: 'Redmi phones and smartwatches with big value.' },
  { slug: 'hisense', name: 'Hisense', blurb: 'Value 4K and Full HD smart TVs.' },
  { slug: 'tcl', name: 'TCL', blurb: 'QLED Google TVs.' },
  { slug: 'vitron', name: 'Vitron', blurb: 'Affordable smart TVs with built-in decoders.' },
  { slug: 'jbl', name: 'JBL', blurb: 'Portable speakers and party sound.' },
  { slug: 'oraimo', name: 'Oraimo', blurb: 'Earbuds, power banks and chargers.' },
  { slug: 'playstation', name: 'PlayStation', blurb: 'PS5 consoles and DualSense controllers.' },
  { slug: 'microsoft', name: 'Xbox', blurb: 'Xbox Series consoles.' },
  { slug: 'nintendo', name: 'Nintendo', blurb: 'Nintendo Switch consoles.' },
  { slug: 'ea', name: 'EA SPORTS', blurb: 'EA SPORTS FC football games.' },
  { slug: 'asus', name: 'ASUS', blurb: 'Vivobook and ROG gaming laptops.' },
  { slug: 'google', name: 'Google', blurb: 'Pixel phones.' },
  { slug: 'canon', name: 'Canon', blurb: 'EOS mirrorless cameras.' },
  { slug: 'gopro', name: 'GoPro', blurb: 'Action cameras.' },
  { slug: 'dji', name: 'DJI', blurb: 'Pocket gimbal cameras.' },
  { slug: 'epson', name: 'Epson', blurb: 'EcoTank ink-tank printers.' },
  { slug: 'apc', name: 'APC', blurb: 'UPS backup power.' },
  { slug: 'tp-link', name: 'TP-Link', blurb: 'Routers, mesh Wi‑Fi and switches.' },
  { slug: 'anker', name: 'Anker', blurb: 'Power banks and chargers.' },
  { slug: 'logitech', name: 'Logitech', blurb: 'Mice and keyboards.' },
  { slug: 'sandisk', name: 'SanDisk', blurb: 'Memory cards and flash storage.' },
];

export const brandBySlug = (slug: string) => brands.find((b) => b.slug === slug);
export const brandName = (slug: string) => brandBySlug(slug)?.name ?? slug;
