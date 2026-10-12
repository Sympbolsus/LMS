import React, { useState, useRef, useEffect } from 'react';

// နမူနာ Nail Art Design များနှင့် လက်ဓာတ်ပုံများ
const SAMPLE_DESIGNS = [
  { id: 1, name: 'Pastel Pink Glossy', url: 'https://images.unsplash.com/photo-1632345031435-8777f6b92a27?w=300' },
  { id: 2, name: 'Classic Red Glam', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300' },
  { id: 3, name: 'Sparkle Gold French', url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=300' },
];

export default function NailTryOnApp() {
  const [handImageSrc, setHandImageSrc] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(SAMPLE_DESIGNS[0].url);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // လက်သည်းနေရာများအတွက် ဥပမာ Coordinates (လက် ၅ ချောင်းစာ နေရာသတ်မှတ်ချက်)
  const [nailBoxes, setNailBoxes] = useState([
    { x: 100, y: 150, w: 35, h: 45 }, // လက်မ
    { x: 150, y: 100, w: 30, h: 40 }, // လက်ညှိုး
    { x: 190, y: 90, w: 30, h: 42 },  // လက်လယ်
    { x: 230, y: 100, w: 28, h: 38 }, // လက်သူကြွယ်
    { x: 270, y: 120, w: 25, h: 35 }, // လက်သန်း
  ]);

  // ဖုန်း/ကွန်ပြူတာမှ လက်ဓာတ်ပုံ Upload တင်ခြင်း
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setHandImageSrc(uploadEvent.target.result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas ပေါ်တွင် လက်ပုံနှင့် Design ကို ပေါင်းစပ်ဆွဲခြင်း (Dynamic Rendering)
  useEffect(() => {
    if (!handImageSrc || !selectedDesign) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handImg = new Image();
    const designImg = new Image();

    handImg.crossOrigin = 'anonymous';
    designImg.crossOrigin = 'anonymous';

    handImg.src = handImageSrc;
    designImg.src = selectedDesign;

    Promise.all([
      new Promise((res) => (handImg.onload = res)),
      new Promise((res) => (designImg.onload = res)),
    ]).then(() => {
      // Canvas အရွယ်အစားကို မူရင်း လက်ပုံ Size အတိုင်း သတ်မှတ်ခြင်း
      canvas.width = handImg.width;
      canvas.height = handImg.height;

      // ၁။ မူရင်း လက်ဓာတ်ပုံကို ဆွဲခြင်း
      ctx.drawImage(handImg, 0, 0);

      // ၂။ လက်သည်း ၅ ချောင်းလုံးအတွက် Loop ပတ်၍ Design များကို နေရာချခြင်း
      nailBoxes.forEach((box) => {
        ctx.save();
        
        // လက်သည်းပုံစံ အကွက်ဖော်၍ Clipping လုပ်ခြင်း
        ctx.beginPath();
        ctx.rect(box.x, box.y, box.w, box.h);
        ctx.clip();

        // ၃။ Blend Mode သုံးပြီး သဘာဝကျကျ (အလင်းအမှောင်ပါဝင်စေရန်) ထပ်ခြင်း
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(designImg, box.x, box.y, box.w, box.h);

        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = 0.4;
        ctx.drawImage(handImg, 0, 0);

        ctx.restore();
      });
    });
  }, [handImageSrc, selectedDesign, nailBoxes]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-pink-100 my-8">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">💅 Virtual Nail Art Try-On</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* ဘယ်ဘက်ခြမ်း - ပုံတင်ရန် နှင့် Design ရွေးချယ်ရန် */}
        <div className="space-y-6">
          <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ၁။ သင့်လက်ဓာတ်ပုံကို Upload တင်ပါ
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ၂။ လိုချင်သော Nail Design ကို ရွေးပါ
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SAMPLE_DESIGNS.map((design) => (
                <div 
                  key={design.id}
                  onClick={() => setSelectedDesign(design.url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1 ${
                    selectedDesign === design.url ? 'border-pink-600 ring-2 ring-pink-300 scale-105' : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <img src={design.url} alt={design.name} className="w-full h-20 object-cover rounded-lg" />
                  <p className="text-[11px] text-center font-medium mt-1 text-gray-700 truncate">{design.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ညာဘက်ခြမ်း - Real-time Result Canvas Preview */}
        <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[350px]">
          {loading ? (
            <p className="text-pink-600 font-medium animate-pulse">ဓာတ်ပုံကို တင်နေပါသည်...</p>
          ) : !handImageSrc ? (
            <div className="text-center text-gray-400 p-8">
              <span className="text-4xl block mb-2">📸</span>
              <p className="text-sm">ကျေးဇူးပြု၍ ဘယ်ဘက်မှ လက်ဓာတ်ပုံ အရင် Upload တင်ပေးပါ</p>
            </div>
          ) : (
            <div className="relative">
              <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto rounded-lg shadow-md border border-pink-300"
              />
              <p className="text-xs text-center text-gray-500 mt-2">
                * ရွေးချယ်ထားသော Design သည် သင့်လက်ပေါ်သို့ သဘာဝကျကျ အလိုအလျောက် ပေါ်နေပါပြီ။
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}