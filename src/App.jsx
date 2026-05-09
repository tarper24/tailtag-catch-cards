import React, { useState, useEffect, useRef } from 'react';
import logo from './assets/logo.png';

const CardContent = ({
  suitName, catchCode, pronouns, displayCon, interests, askMeAbout, showWatermark,
  isPreview, sizeLevel = 0, onSizeChange
}) => {
  const textContainerRef = useRef(null);

  // If this is the preview card, reset the text size whenever the user types new content
  useEffect(() => {
    if (isPreview && onSizeChange) {
      onSizeChange(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interests, askMeAbout, suitName, displayCon]);

  // Measure the available space in the preview card and shrink if necessary
  useEffect(() => {
    if (!isPreview || !onSizeChange) return;

    const checkFit = () => {
      if (!textContainerRef.current) return;
      const { scrollHeight, clientHeight } = textContainerRef.current;

      // If the actual text height is larger than the container, step down the size
      if (scrollHeight > clientHeight + 2 && sizeLevel < 3) {
        onSizeChange(sizeLevel + 1);
      }
    };

    const timer = setTimeout(checkFit, 15);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interests, askMeAbout, sizeLevel, isPreview]);

  // The 4 different scale levels for fonts and margins
  const style = [
    { text: 'text-sm', header: 'text-xs', space: 'space-y-4', gap: 'space-y-1', mt: 'mt-4', mb: 'mb-2', pb: 'pb-1' },
    { text: 'text-xs', header: 'text-[10px]', space: 'space-y-2', gap: 'space-y-0.5', mt: 'mt-2', mb: 'mb-1', pb: 'pb-0.5' },
    { text: 'text-[10px] leading-tight', header: 'text-[9px]', space: 'space-y-1', gap: 'space-y-0', mt: 'mt-1', mb: 'mb-0.5', pb: 'pb-0' },
    { text: 'text-[8.5px] leading-tight', header: 'text-[8.5px]', space: 'space-y-0.5', gap: 'space-y-0', mt: 'mt-0.5', mb: 'mb-0', pb: 'pb-0' }
  ][sizeLevel];

  return (
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
      <div className="bg-[#0B1320] text-white p-4 flex items-center justify-between border-b-4 border-[#23A9E1] relative z-10 box-border w-full flex-shrink-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="TailTag" className="w-8 h-8 drop-shadow-md object-contain" />
          <span className="font-bold text-xl tracking-wider m-0 p-0">TailTag</span>
        </div>
        <div className="text-xs font-semibold text-[#8B9DB6] uppercase tracking-widest text-right leading-tight max-w-[50%] break-words">
          {displayCon || 'CON'}
        </div>
      </div>

      {/* Main Content Area */}
      {/* pb-10 guarantees it stops before touching the absolute footer */}
      <div className="p-5 pb-10 flex-grow flex flex-col justify-start relative z-10 box-border w-full h-full overflow-hidden">

        {/* Identity Section */}
        <div className="text-center mb-4 mt-2 flex-shrink-0">
          <h1 className="text-4xl font-extrabold mb-1 leading-none break-words line-clamp-2 m-0 p-0" style={{ color: '#111827' }}>
            {suitName || 'Name'}
          </h1>
          <p className="text-[#6B7280] font-medium text-sm h-5 m-0 p-0">{pronouns}</p>
        </div>

        {/* Catch Code Badge */}
        <div className="flex flex-col items-center mb-6 flex-shrink-0">
          <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Catch Code</span>
          <div className="bg-[#EAF6FA] text-[#1C88B5] border-2 border-[#23A9E1] px-6 py-2 rounded-lg font-mono font-bold text-2xl tracking-[0.2em] shadow-sm uppercase min-w-[160px] text-center">
            {catchCode || 'XXXXXX'}
          </div>
        </div>

        {/* Details Sections - Auto Scaling Container */}
        <div ref={textContainerRef} className={`flex-grow text-left overflow-hidden ${style.space} min-h-0`}>
          {interests && (
            <div>
              <h3 className={`${style.header} font-bold text-[#23A9E1] uppercase tracking-widest border-b border-[#E5E7EB] ${style.pb} ${style.mb} m-0`}>Interests</h3>
              <ul className={`${style.text} text-[#374151] ${style.gap} m-0 p-0 list-none`}>
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
              <h3 className={`${style.header} font-bold text-[#23A9E1] uppercase tracking-widest border-b border-[#E5E7EB] ${style.pb} ${style.mb} m-0 ${style.mt}`}>Ask me about...</h3>
              <ul className={`${style.text} text-[#374151] ${style.gap} m-0 p-0 list-none`}>
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
      {/* Absolutely positioned so the text container can never push it off the card */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#F9FAFB] p-2 text-center text-[10px] text-[#9CA3AF] font-medium border-t border-[#E5E7EB] z-20 m-0 box-border">
        Log this catch at PlayTailTag.com
      </div>
    </div>
  );
};

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

  // Lifted state: App owns the sizeLevel so both Preview and Print match exactly
  const [sizeLevel, setSizeLevel] = useState(0);

  // Scaling state for visual UI preview only
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        // Adjust for mobile screens where vertical space is constrained
        const availableHeight = window.innerHeight > 600 ? window.innerHeight - 64 : 400;

        const cardWidth = 408;
        const cardHeight = 528;

        const widthScale = (availableWidth - 32) / cardWidth;
        const heightScale = window.innerWidth >= 1024 ? (availableHeight) / cardHeight : 2;

        const finalScale = Math.min(widthScale, heightScale, 1.8);
        setScale(Math.max(0.4, finalScale)); // Slightly larger minimum scale
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

  return (
    <>
      {/* --- SCREEN VIEW (Hidden during print) --- */}
      <div className="print:hidden min-h-screen bg-[#0B1320] p-4 lg:p-8 text-white flex flex-col lg:flex-row gap-8 justify-center items-start font-sans overflow-x-hidden w-full max-w-[1600px] mx-auto text-left">

        {/* Editor Panel */}
        <div className="w-full lg:max-w-xl bg-[#162133] border border-[#2A3B54] p-6 lg:p-8 rounded-xl shadow-lg shrink-0 lg:flex-1">
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

        {/* Preview Panel - This card is visible and calculates the sizeLevel */}
        <div
          ref={containerRef}
          className="w-full flex-grow lg:flex-1 flex justify-center items-start lg:sticky lg:top-8 overflow-hidden pb-10"
          style={{ minHeight: `${5.5 * scale}in` }}
        >
          <div
            className="relative"
            style={{ width: `${4.25 * scale}in`, height: `${5.5 * scale}in` }}
          >
            <div
              className="absolute top-0 left-0 origin-top-left shadow-2xl border border-[#9CA3AF] overflow-hidden bg-white"
              style={{ transform: `scale(${scale})`, width: '4.25in', height: '5.5in' }}
            >
              <CardContent
                {...cardData}
                isPreview={true}
                sizeLevel={sizeLevel}
                onSizeChange={setSizeLevel}
              />
            </div>
          </div>
        </div>

      </div>

      {/* --- PRINT VIEW (Hidden on screen) --- */}
      <div className="hidden print:block w-full bg-white m-0 p-0 box-border">

        {/* We use strict absolute positioning.
            No flexbox or grid squishing. The entire block is exactly 8.5in x 5.5in.
            The landscape top margin explicitly ensures it isn't glued to the absolute top of the page.
        */}
        <div
          className="relative border border-[#9CA3AF] bg-white overflow-hidden box-border mx-auto"
          style={{
            width: '8.5in',
            height: '5.5in',
            marginTop: printOrientation === 'landscape' ? '0.5in' : '0',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}
        >

          {/* Left Card - Receives the sizeLevel calculated by the preview */}
          <div className="absolute left-0 top-0 w-[4.25in] h-[5.5in] box-border">
            <CardContent {...cardData} sizeLevel={sizeLevel} />
          </div>

          {/* Fold Line */}
          <div className="absolute left-[4.25in] top-0 bottom-0 w-px border-l-2 border-dashed border-[#9CA3AF] z-20" />

          {/* Right Card - Receives the sizeLevel calculated by the preview */}
          <div className="absolute left-[4.25in] top-0 w-[4.25in] h-[5.5in] box-border">
            <CardContent {...cardData} sizeLevel={sizeLevel} />
          </div>

        </div>

      </div>

      {/* Print Styles fallback - Includes aggressive resets for dark mode backgrounds */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html, #root {
            background-color: transparent !important;
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          /* We clear the OS hardware margins so our explicit 0.5in marginTop handles placement safely */
          @page {
            size: letter ${printOrientation};
            margin: 0;
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
