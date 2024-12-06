import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export function Debug() {
  const auth = useAuthContext();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono">
      <pre>
        {JSON.stringify(
          {
            user: auth.user?.email,
            loading: auth.loading,
            profile: auth.profile?.name,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
