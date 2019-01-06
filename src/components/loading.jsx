import React from 'react';
export default function Loading({ show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="vloading" />
  );
}