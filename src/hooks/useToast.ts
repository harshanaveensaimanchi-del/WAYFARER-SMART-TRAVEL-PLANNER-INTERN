import { useState, useCallback, useRef } from 'react';

export function useToast(duration = 2500) {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const toast = useCallback(
    (msg: string) => {
      setMessage(msg);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(''), duration);
    },
    [duration]
  );

  const dismiss = useCallback(() => setMessage(''), []);

  return { message, toast, dismiss };
}
