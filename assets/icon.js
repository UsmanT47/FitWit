import React from 'react';
import { Svg, Circle, Path, G } from 'react-native-svg';

export default function FitWitIcon({ width = 100, height = 100, color = '#4285F4' }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="45" fill="#FFFFFF" />
      <Circle cx="50" cy="50" r="40" fill={color} opacity="0.1" />
      <G fill={color}>
        <Path d="M30,40 L40,40 L40,70 L30,70 Z" />
        <Path d="M45,30 L55,30 L55,70 L45,70 Z" />
        <Path d="M60,50 L70,50 L70,70 L60,70 Z" />
        <Circle cx="35" cy="30" r="5" />
        <Circle cx="50" cy="20" r="5" />
        <Circle cx="65" cy="40" r="5" />
      </G>
    </Svg>
  );
}