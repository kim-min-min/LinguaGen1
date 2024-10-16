import React, { useEffect, useRef, useState } from 'react';
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import LegendLite from 'cal-heatmap/plugins/LegendLite'; // LegendLite 플러그인 import
import Tooltip from 'cal-heatmap/plugins/Tooltip'; // Tooltip 플러그인 import

const HeatMap = () => {
  const calRef = useRef(null);
  const calInstance = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [startMonth, setStartMonth] = useState(new Date('2023-01-01'));

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const initializeCalHeatmap = () => {
        if (!calInstance.current) {
          calInstance.current = new CalHeatmap();
        }
        const data = [
          { date: '2023-01-01', value: 1 },
          { date: '2023-01-02', value: 2 },
          { date: '2023-01-03', value: 3 },
          { date: '2023-02-01', value: 4 },
          { date: '2023-02-10', value: 5 },
          { date: '2023-03-15', value: 8 },
          { date: '2023-04-20', value: 12 },
          { date: '2023-05-25', value: 16 }
        ];

        calInstance.current.paint({
          data: {
            source: data,
            x: 'date',
            y: 'value',
          },
          date: { start: startMonth },
          range: 5,
          scale: {
            color: {
              type: 'threshold',
              range: ['#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#059669'],
              domain: [3, 6, 9, 12, 15],
            },
          },
          domain: {
            type: 'month',
            gutter: 4,
            label: { text: 'MMM', textAlign: 'start', position: 'top' },
          },
          subDomain: {
            type: 'day',
            width: 30,
            height: 20,
            gutter: 5,
            radius: 5,
          },
          itemSelector: calRef.current,
        }, 
        [
          [LegendLite, {
            itemSelector: '#legend',
            width: 30,
            height: 20,
            gutter: 5,
            radius: 5,
            includeBlank: true,
          }],
          [Tooltip, {
            text: (timestamp, value, dayjsDate) => {
              return `Date: ${dayjsDate.format('YYYY-MM-DD')}, Play: ${value || 0}`;
            }
          }]
        ]);
      };

      initializeCalHeatmap();
    }

    return () => {
      if (calInstance.current) {
        calInstance.current.destroy();
      }
    };
  }, [isMounted, startMonth]);

  const handlePrevious = () => {
    const newStartDate = new Date(startMonth);
    newStartDate.setMonth(startMonth.getMonth() - 1);
    setStartMonth(newStartDate);
  };

  const handleNext = () => {
    const newStartDate = new Date(startMonth);
    newStartDate.setMonth(startMonth.getMonth() + 1);
    setStartMonth(newStartDate);
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={calRef} 
        id="ex-ghDay" 
        className="flex-grow"
        style={{
          background: '#fff',
          color: '#adbac7',
          borderRadius: '3px',
          padding: '1rem',
          overflow: 'hidden',
        }}
      ></div>
      <div id="legend" className="mt-4" style={{ marginLeft: '45px' }}></div>
      <div className="flex justify-between items-center mt-4 px-4">
        <div>
          <button
            style={{outline : 'none'}}
            className="button button--sm button--secondary"
            onClick={handlePrevious}
          >
            ← Previous
          </button>
          <button
            style={{outline : 'none'}}

            className="button button--sm button--secondary ml-2"
            onClick={handleNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
