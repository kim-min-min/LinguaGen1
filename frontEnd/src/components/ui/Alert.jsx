import React from 'react';
import { X } from 'lucide-react';

export const Alert = ({
                          children,
                          variant = 'default',
                          onClose
                      }) => {
    const getVariantStyles = () => {
        switch(variant) {
            case 'destructive':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'warning':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'success':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className={`rounded-lg border p-4 mt-2 flex items-start gap-2 ${getVariantStyles()}`}>
            {children}
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-auto hover:opacity-70"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export const AlertDescription = ({ children }) => {
    return <div className="text-sm">{children}</div>;
};