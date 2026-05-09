import React, { useState, useEffect, useRef } from 'react';
import logo from './assets/logo.png';

const CardContent = ({ suitName, catchCode, pronouns, displayCon, interests, askMeAbout, showWatermark }) => (
  <div className="w-full h-full bg-[#FFFFFF] text-[#111827] flex flex-col relative overflow-hidden text-left box-border">
    
    {/* Optional Background Watermark */}
    {showWatermark && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src={logo} 
          alt="" 
          className="w-full h-full object-contain opacity-[0.04] grayscale scale-[1.35]" 
        />
      </div>
    )}

    {/* Header Ribbon */}
    <div className="bg-[#0B1320] text-white p-4 flex items-center justify-between border-b-4 border-[#23A9E1] relative z-10 box-border w-full">
      <div className="flex items-center gap-2 flex-shrink-0">
        <img src={logo} alt="TailTag" className="w-8 h-8 drop-shadow-md object-contain" />
        <span className="font-bold text-xl tracking-wider m-0 p-0">TailTag</span>
      </div>
      <div className="text-xs font-semibold text-[#8B9DB6] uppercase tracking-widest text-right leading-tight max-w-[50%] break-words">
        {displayCon || 'CON'}
      </div>
    </div>

    {/* Main Content */}
    <div className="p-5 flex-grow flex flex-col justify-between relative z-10 box-border w-full">
      
      {/* Identity Section */}
      <div className="text-center mb-4 mt-2">
        <h1 className="text-4xl font-extrabold mb-1 leading-none break-words line-clamp-2 m-0 p-0" style={{ color: '#111827' }}>
          {suitName || 'Name'}
        </h1>
        <p className="text-[#6B7280] font-medium text-sm h-5 m-0 p-0">{pronouns}</p>
      </div>

      {/* Catch Code Badge */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Catch Code</span>
        <div className="bg-[#EAF6FA] text-[#1C88B5] border-2 border-[#23A9E1] px-6 py-2 rounded-lg font-mono font-bold text-2xl tracking-[0.2em] shadow-sm uppercase min-w-[160px] text-center">
          {catchCode || 'XXXXXX'}
        </div>
      </div>

      {/* Details Sections */}
      <div className="space-y-4 flex-grow text-left">
        {interests && (
          <div>
            <h3 className="text-xs font-bold text-[#23A9E1] uppercase tracking-widest border-b border-[#E5E7EB] pb-1 mb-2 m-0">Interests</h3>
            <ul className="text-sm text-[#374151] space-y-1 m-0 p-0 list-none">
              {interests.split('\n').map((item, i) => item.trim() && (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#23A9E1] mt-0.5">•</span>
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {askMeAbout && (
          <div>
            <h3 className="text-xs font-bold text-[#23A9E1] uppercase tracking-widest border-b border-[#E5E7EB] pb-1 mb-2 m-0 mt-4">Ask me about...</h3>
            <ul className="text-sm text-[#374151] space-y-1 m-0 p-0 list-none">
              {askMeAbout.split('\n').map((item, i) => item.trim() && (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#23A9E1] mt-0.5">•</span>
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <div className="bg-[#F9FAFB] p-2 text-center text-[10px] text-[#9CA3AF] font-medium border-t border-[#E5E7EB] relative z-10 m-0 box-border w-full">
      Log this catch at PlayTailTag.com
    </div>
  </div>
);

export default function App() {
  const [suitName, setSuitName] = useState('');
  const [catchCode, setCatchCode] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [conSelection, setConSelection] = useState('FWA 2026');
  const [customCon, setCustomCon] = useState('');
  const [interests, setInterests] = useState('');
  const [askMeAbout, setAskMeAbout] = useState('');
  
  const [showWatermark, setShowWatermark] = useState(true);
  const [printOrientation, setPrintOrientation] = useState('portrait');

  // Scaling state for the screen preview only
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        const availableHeight = window.innerHeight - 64; 
        
        const cardWidth = 408; 
        const cardHeight = 528; 
        
        const widthScale = (availableWidth - 32) / cardWidth;
        const heightScale = window.innerWidth >= 1024 ? (availableHeight) / cardHeight : 2; 

        const finalScale = Math.min(widthScale, heightScale, 1.8);
        setScale(Math.max(0.3, finalScale));
      }
    };

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    
    window.addEventListener('resize', updateScale);
    setTimeout(updateScale, 10);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const displayCon = conSelection === 'Custom' ? customCon : conSelection;
  const cardData = { suitName, catchCode, pronouns, displayCon, interests, askMeAbout, showWatermark };

  // Generate strict positioning styles for iOS print layout
  const printWrapperStyle = printOrientation === 'landscape' 
    ? { width: '8.5in', height: '5.5in', marginTop: '1.25in', marginLeft: 'auto', marginRight: 'auto' }
    : { width: '8.5in', height: '5.5in', margin: '0 auto' };

  return (
    <>
      {/* --- SCREEN VIEW (Hidden during print) --- */}
      <div className="print:hidden min-h-screen bg-[#0B1320] p-4 lg:p-8 text-white flex flex-col lg:flex-row gap-8 justify-center items-start font-sans overflow-x-hidden w-full max-w-[1600px] mx-auto text-left">
        
        {/* Editor Panel */}
        <div className="w-full lg:max-w-xl bg-[#162133] border border-[#2A3B54] p-6 lg:p-8 rounded-xl shadow-lg shrink-0 flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-wide m-0 p-0">Card Editor</h2>
            <p className="text-[#8B9DB6] text-sm mt-1 m-0 p-0">Fill out your fursuit details to generate your printable catch cards.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#8B9DB6] mb-1">Convention</label>
              <select 
                value={conSelection}
                onChange={(e) => setConSelection(e.target.value)}
                className="w-full bg-[#0B1320] border border-[#2A3B54] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#23A9E1] appearance-none"
              >
                <option value="FWA 2026">FWA 2026</option>
                <option value="Anthrocon 2026">Anthrocon 2026</option>
                <option value="MFF 2026">MFF 2026</option>
                <option value="TFC 2026">TFC 2026</option>
                <option value="Custom">Custom...</option>
              </select>
              
              {conSelection === 'Custom' && (
                <input 
                  type="text" 
                  value={customCon} 
                  onChange={(e) => setCustomCon(e.target.value)}
                  placeholder="Short name (e.g. FWA 2026)"
                  maxLength={14}
                  className="w-full mt-2 bg-[#0B1320] border border-[#2A3B54] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#23A9E1]"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B9DB6] mb-1">Fursuit Name</label>
              <input 
                type="text" 
                value={suitName} 
                onChange={(e) => setSuitName(e.target.value)}
                className="w-full bg-[#0B1320] border border-[#2A3B54] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#23A9E1]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B9DB6] mb-1">Catch Code</label>
              <input 
                type="text" 
                value={catchCode} 
                onChange={(e) => setCatchCode(e.target.value)}
                maxLength={8}
                className="w-full bg-[#0B1320] border border-[#2A3B54] rounded-lg p-2.5 text-[#23A9E1] font-mono font-bold focus:outline-none focus:border-[#23A9E1] uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B9DB6] mb-1">Pronouns</label>
              <input 
                type="text" 
                value={pronouns} 
                onChange={(e) => setPronouns(e.target.value)}
                className="w-full bg-[#0B1320] border border-[#2A3B54] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#23A9E1]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#8B9DB6] mb-1">Interests</label>
              <textarea 
                value={interests} 
                onChange={(e) => setInterests(e.target.value)}
                rows={3}
                className="w-full bg-[#0B1320] border border-[#2A3B54] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#23A9E1] resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#8B9DB6] mb-1">Ask Me About...</label>
              <textarea 
                value={askMeAbout} 
                onChange={(e) => setAskMeAbout(e.target.value)}
                rows={3}
                className="w-full bg-[#0B1320] border border-[#2A3B54] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#23A9E1] resize-none"
              />
            </div>
          </div>

          {/* Print Settings Section */}
          <div className="mt-8 pt-6 border-t border-[#2A3B54]">
            <h3 className="text-lg font-bold text-white mb-4 m-0 p-0">Print Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-sm font-semibold text-[#8B9DB6] mb-1">Paper Orientation</label>
                <select 
                  value={printOrientation}
                  onChange={(e) => setPrintOrientation(e.target.value)}
                  className="w-full bg-[#0B1320] border border-[#2A3B54] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#23A9E1] appearance-none"
                >
                  <option value="portrait">Portrait (Aligns to Top Edge)</option>
                  <option value="landscape">Landscape (Centered on page)</option>
                </select>
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer group m-0">
                  <div className="relative flex items-center justify-center w-6 h-6 bg-[#0B1320] border border-[#2A3B54] rounded group-hover:border-[#23A9E1] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={showWatermark}
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="absolute opacity-0 w-full h-full cursor-pointer m-0 p-0"
                    />
                    {showWatermark && (
                      <svg className="w-4 h-4 text-[#23A9E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-[#23A9E1] transition-colors">
                    Background Watermark
                  </span>
                </label>
              </div>

            </div>
          </div>

          <button 
            onClick={handlePrint}
            className="mt-8 w-full bg-[#23A9E1] hover:bg-[#1C88B5] text-[#0B1320] font-bold py-3 px-4 rounded-full transition-colors flex justify-center items-center gap-2 cursor-pointer border-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Double-Sided Card
          </button>
          
          <div className="mt-4 p-4 bg-[#0B1320] border border-[#2A3B54] rounded-lg">
            <h4 className="text-sm font-bold text-[#23A9E1] mb-2 uppercase tracking-wide">How to assemble:</h4>
            <ol className="text-sm text-[#8B9DB6] list-decimal list-inside space-y-1 m-0 p-0">
              <li>Print your generated card.</li>
              <li>Cut the large outer box out of the paper.</li>
              <li>Fold along the dashed gray line to create a double-sided card.</li>
              <li>Slide it into your badge holder!</li>
            </ol>
          </div>
        </div>

        {/* Preview Panel */}
        <div 
          ref={containerRef}
          className="w-full flex-1 flex justify-center items-start lg:sticky lg:top-8 overflow-hidden pb-10"
          style={{ minHeight: `${5.5 * scale}in` }}
        >
          <div className="relative">
            <div 
              className="absolute top-0 left-0 origin-top-left shadow-2xl border border-[#9CA3AF] overflow-hidden bg-white"
              style={{ transform: `scale(${scale})`, width: '4.25in', height: '5.5in' }}
            >
              <CardContent {...cardData} />
            </div>
          </div>
        </div>

      </div>

      {/* --- PRINT VIEW (Hidden on screen) --- */}
      {/* Using 'block' and absolute positioning prevents iOS Safari from breaking Flexbox layouts.
        If Safari enforces hardware margins (e.g. 8.0" max width), the absolute boundaries force Safari 
        to trigger its native "Shrink to Fit" scaling on the entire document uniformly. 
      */}
      <div className="hidden print:block w-full bg-white m-0 p-0 box-border">
        
        <div 
          className="relative border border-[#9CA3AF] box-border overflow-hidden print-wrapper"
          style={printWrapperStyle}
        >
          
          {/* Card Left - Absolutely positioned to 0 */}
          <div className="absolute left-0 top-0 bottom-0 w-[4.25in] box-border">
            <CardContent {...cardData} />
          </div>
          
          {/* Plain Fold Line Indicator - Absolutely positioned exactly in the center */}
          <div className="absolute left-[4.25in] top-0 bottom-0 w-px border-l-2 border-dashed border-[#9CA3AF] z-20" />

          {/* Card Right - Absolutely positioned precisely after the fold line */}
          <div className="absolute left-[4.25in] top-0 bottom-0 w-[4.25in] box-border">
            <CardContent {...cardData} />
          </div>
          
        </div>

      </div>
      
      {/* Print Styles fallback */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html {
            background: #FFFFFF !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
          @page {
            size: letter ${printOrientation};
            margin: 0cm; 
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}} />
    </>
  );
}
