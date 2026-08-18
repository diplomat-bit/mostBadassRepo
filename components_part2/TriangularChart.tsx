// REPOSITORY SOURCE: diplomat-bit/illi | PATH: diplomat-bit-illi-d81a5ee/components/TriangularChart.tsx
================================================================================


import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';

interface Props {
  n: number;
}

export const TriangularChart: React.FC<Props> = ({ n }) => {
  const data = useMemo(() => {
    const points = [];
    for (let row = 0; row < n; row++) {
      for (let col = 0; col <= row; col++) {
        points.push({
          x: col - row / 2,
          y: -row,
          z: 10
        });
      }
    }
    return points;
  }, [n]);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <XAxis type="number" dataKey="x" hide domain={[-n/2 - 1, n/2 + 1]} />
          <YAxis type="number" dataKey="y" hide domain={[-n - 1, 1]} />
          <ZAxis type="number" range={[20, 80]} />
          <Scatter 
            name="Points" 
            data={data} 
            fill="#00ffff" 
            className="triangular-dot" 
            stroke="#ff00ff"
            strokeWidth={1}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
