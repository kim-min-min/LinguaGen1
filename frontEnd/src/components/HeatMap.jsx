import React, { useEffect, useRef, useState } from 'react';
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import axios from 'axios';

const HeatMap = () => {
    const calRef = useRef(null);
    const calInstance = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const [startMonth, setStartMonth] = useState(new Date('2024-10-01'));

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // sessionStorage에서 user 정보를 가져옴
            const user = sessionStorage.getItem('user');
            if (!user) {
                console.error("User not found in session storage");
                return;
            }

            const userData = JSON.parse(user);

            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/study-log/daily-plays/${userData.id}`, {withCredentials: true});
                const playData = response.data.map(item => ({
                    date: item.date,
                    value: item.playCount,
                }));
                initializeCalHeatmap(playData);
            } catch (error) {
                console.error('Error fetching play data:', error);
            }
        };

        if (isMounted) {
            fetchData();
        }

        return () => {
            if (calInstance.current) {
                calInstance.current.destroy();
            }
        };
    }, [isMounted, startMonth]);

    const initializeCalHeatmap = (data) => {
        if (!calInstance.current) {
            calInstance.current = new CalHeatmap();
        }

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
                        domain: [1, 5, 10, 20, 30],
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
