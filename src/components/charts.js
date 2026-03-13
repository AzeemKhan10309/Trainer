import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types'; // ✅ import prop-types

function BaseChart({ style, children }) {
  return (
    <View
      style={[
        {
          width: '100%',
          minHeight: 220,
          borderRadius: 16,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1C1C2A',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Prop types for BaseChart
BaseChart.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
};

export function LineChart({ style }) {
  return <BaseChart style={style} />;
}

export function BarChart({ style }) {
  return <BaseChart style={style} />;
}

// Prop types for LineChart and BarChart
LineChart.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

BarChart.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};