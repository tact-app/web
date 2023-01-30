import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';

export default function useCopyToClipboard<T = unknown>(
    resetInterval: number | null = null
): [(text: T) => void, boolean] {
    const [isCopied, setCopied] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isCopied && resetInterval) {
            timeout = setTimeout(() => setCopied(false), resetInterval);
        }

        return () => clearTimeout(timeout);
    }, [isCopied, resetInterval]);

    const handleCopy = (text: T): void => {
        if (text) {
            copy(String(text));

            setCopied(true);
        } else {
            setCopied(false);
        }
    };

    return [handleCopy, isCopied];
}
