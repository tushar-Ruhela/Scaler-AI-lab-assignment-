export default function Footer() {
  return (
export default function Footer() {
  return (
    <footer className="bg-[#172337] text-white pt-10 mt-10 text-[12px] font-sans">
      <div className="max-w-[1280px] mx-auto px-6 pb-12 flex flex-wrap gap-x-8 gap-y-10 group">
        <div className="flex-1 min-w-[140px]">
          <h4 className="text-gray-400 font-normal mb-4 uppercase tracking-tighter text-[11px]">ABOUT</h4>
          <div className="space-y-2">
            <a href="#" className="block hover:underline">Contact Us</a>
            <a href="#" className="block hover:underline">About Us</a>
            <a href="#" className="block hover:underline">Careers</a>
            <a href="#" className="block hover:underline">Flipkart Stories</a>
            <a href="#" className="block hover:underline">Press</a>
            <a href="#" className="block hover:underline">Corporate Information</a>
          </div>
        </div>
        
        <div className="flex-1 min-w-[140px]">
          <h4 className="text-gray-400 font-normal mb-4 uppercase tracking-tighter text-[11px]">GROUP COMPANIES</h4>
          <div className="space-y-2">
            <a href="#" className="block hover:underline">Myntra</a>
            <a href="#" className="block hover:underline">Cleartrip</a>
            <a href="#" className="block hover:underline">Shopsy</a>
          </div>
        </div>
        
        <div className="flex-1 min-w-[140px]">
          <h4 className="text-gray-400 font-normal mb-4 uppercase tracking-tighter text-[11px]">HELP</h4>
          <div className="space-y-2">
            <a href="#" className="block hover:underline">Payments</a>
            <a href="#" className="block hover:underline">Shipping</a>
            <a href="#" className="block hover:underline">Cancellation & Returns</a>
            <a href="#" className="block hover:underline">FAQ</a>
          </div>
        </div>
        
        <div className="flex-1 min-w-[140px]">
          <h4 className="text-gray-400 font-normal mb-4 uppercase tracking-tighter text-[11px]">CONSUMER POLICY</h4>
          <div className="space-y-2">
            <a href="#" className="block hover:underline">Cancellation & Returns</a>
            <a href="#" className="block hover:underline">Terms Of Use</a>
            <a href="#" className="block hover:underline">Security</a>
            <a href="#" className="block hover:underline">Privacy</a>
            <a href="#" className="block hover:underline">Sitemap</a>
            <a href="#" className="block hover:underline">Grievance Redressal</a>
            <a href="#" className="block hover:underline">EPR Compliance</a>
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px] md:pl-8 border-l border-gray-700/50">
          <h4 className="text-gray-400 font-normal mb-4 uppercase tracking-tighter text-[11px]">Mail Us:</h4>
          <p className="leading-relaxed text-white/90">
            Flipkart Internet Private Limited,<br />
            Buildings Alyssa, Begonia &<br />
            Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103,<br />
            Karnataka, India
          </p>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <h4 className="text-gray-400 font-normal mb-4 uppercase tracking-tighter text-[11px]">Registered Office Address:</h4>
          <p className="leading-relaxed text-white/90">
            Flipkart Internet Private Limited,<br />
            Buildings Alyssa, Begonia &<br />
            Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103,<br />
            Karnataka, India<br />
            CIN : U51109KA2012PTC066107<br />
            Telephone: <a href="tel:04445614700" className="text-blue-primary font-bold hover:underline">044-45614700</a> / <a href="tel:04467415800" className="text-blue-primary font-bold hover:underline">044-67415800</a>
          </p>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto border-t border-gray-700/50 py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4">
          <a href="#" className="flex items-center gap-2 text-white hover:text-blue-primary transition-colors">
            <span className="w-4 h-4 rounded-full bg-blue-primary/20 flex items-center justify-center">💼</span>
            Become a Seller
          </a>
          <a href="#" className="flex items-center gap-2 text-white hover:text-blue-primary transition-colors">
            <span className="w-4 h-4 rounded-full bg-blue-primary/20 flex items-center justify-center">📢</span>
            Advertise
          </a>
          <a href="#" className="flex items-center gap-2 text-white hover:text-blue-primary transition-colors">
            <span className="w-4 h-4 rounded-full bg-blue-primary/20 flex items-center justify-center">🎁</span>
            Gift Cards
          </a>
          <a href="#" className="flex items-center gap-2 text-white hover:text-blue-primary transition-colors">
            <span className="w-4 h-4 rounded-full bg-blue-primary/20 flex items-center justify-center">❓</span>
            Help Center
          </a>
        </div>
        <div className="text-white/60 font-medium">
          © 2007-2026 Flipkart.com
        </div>
        <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
          <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment Methods" className="h-6" />
        </div>
      </div>
    </footer>
  );
}
  );
}
