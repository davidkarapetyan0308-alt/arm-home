import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CompareBar() {
  const { compareIds, properties, toggleCompare, formatPrice, lang } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Do not render on ComparePage itself or if nothing is selected
  if (compareIds.size === 0 || location.pathname === '/compare') {
    return null;
  }

  const selectedProperties = properties.filter(p => compareIds.has(p.id));

  const getObjectText = (count: number, lang: string) => {
    if (lang === 'EN') return count === 1 ? '1 property' : `${count} properties`;
    if (lang === 'AM') return `${count} օբյեկտ`;
    
    // Russian plural rules
    if (count === 1) return '1 объект';
    if (count >= 2 && count <= 4) return `${count} объекта`;
    return `${count} объектов`;
  };

  const getCompareText = (lang: string) => {
    if (lang === 'EN') return 'Compare';
    if (lang === 'AM') return 'Համեմատել';
    return 'Сравнить';
  };

  const getTitleText = (lang: string) => {
    if (lang === 'EN') return 'Comparison';
    if (lang === 'AM') return 'Համեմատություն';
    return 'Сравнение';
  };

  return (
    <div className="absolute bottom-[56px] left-0 w-full px-3 pb-2 z-40 pointer-events-none animate-slide-up">
      <div className="w-full bg-white/90 backdrop-blur-xl border border-outline-variant/40 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] overflow-hidden pointer-events-auto transition-all duration-300">
        
        {/* Drag Handle / Toggle Header */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full px-4 py-2.5 bg-surface-container-low flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-tuff-terracotta font-bold">
              compare_arrows
            </span>
            <span className="text-xs font-extrabold text-primary">
              {getTitleText(lang)}: <span className="text-tuff-terracotta">{getObjectText(compareIds.size, lang)}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Action Button to navigate to Compare Page */}
            {selectedProperties.length >= 2 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/compare');
                }}
                className="bg-tuff-terracotta text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm hover:bg-secondary transition-all active:scale-95"
              >
                {getCompareText(lang)}
              </button>
            )}

            {/* Collapse Icon */}
            <span className="material-symbols-outlined text-outline text-lg transition-transform duration-300" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              keyboard_arrow_down
            </span>
          </div>
        </div>

        {/* Selected List Section (Collapsible) */}
        <div 
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{ height: isCollapsed ? '0px' : '76px', opacity: isCollapsed ? 0 : 1 }}
        >
          <div className="px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar items-center">
            {selectedProperties.map(p => (
              <div 
                key={p.id} 
                className="relative flex-shrink-0 w-[60px] flex flex-col items-center gap-0.5 animate-fade-in group"
              >
                {/* Image */}
                <div className="w-11 h-11 rounded-lg overflow-hidden border border-outline-variant/30 relative">
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Close Badge */}
                <button
                  onClick={() => toggleCompare(p.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-outline-variant text-on-surface hover:bg-error hover:text-white rounded-full flex items-center justify-center text-[10px] shadow-sm transition-colors cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                </button>

                {/* Price tag */}
                <span className="text-[9px] font-bold text-primary truncate w-full text-center">
                  {formatPrice(p.price)}
                </span>
                
                {/* District */}
                <span className="text-[7px] text-outline truncate w-full text-center">
                  {p.district}
                </span>
              </div>
            ))}

            {/* Add more placeholder if slots left */}
            {selectedProperties.length < 4 && (
              <div 
                onClick={() => navigate('/feed')}
                className="flex-shrink-0 w-11 h-11 rounded-lg border border-dashed border-outline-variant/60 flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-all cursor-pointer active:scale-95"
                title="Добавить еще объект"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
