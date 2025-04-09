import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryScatter } from 'victory-native';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';
import EmptyState from './EmptyState';

const screenWidth = Dimensions.get('window').width;

const ProgressChart = ({
  data = [],
  title = 'Progress Chart',
  xAxisLabel = 'Date',
  yAxisLabel = 'Value',
  color = null,
  style = {},
  emptyStateMessage = 'No data available to display chart',
}) => {
  const { theme } = useTheme();
  
  // If no data or empty data array, show empty state
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {title}
        </Text>
        <EmptyState
          icon="bar-chart-2"
          title="No Data"
          message={emptyStateMessage}
        />
      </View>
    );
  }
  
  // Create chart theme based on app theme
  const chartTheme = {
    ...VictoryTheme.material,
    axis: {
      ...VictoryTheme.material.axis,
      style: {
        ...VictoryTheme.material.axis.style,
        axis: {
          ...VictoryTheme.material.axis.style.axis,
          stroke: theme.textSecondary,
        },
        tickLabels: {
          ...VictoryTheme.material.axis.style.tickLabels,
          fill: theme.textSecondary,
          fontSize: 10,
        },
        grid: {
          ...VictoryTheme.material.axis.style.grid,
          stroke: theme.border,
          strokeWidth: 0.5,
        },
      },
    },
  };
  
  // Calculate chart domain
  const yValues = data.map(d => d.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const padding = (maxY - minY) * 0.1 || 1;  // 10% padding or at least 1
  
  return (
    <View style={[styles.container, style]}>
      <Text 
        style={[styles.title, { color: theme.text }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      
      <View style={styles.chartContainer}>
        <VictoryChart
          width={screenWidth - 40}
          height={180}
          theme={chartTheme}
          padding={{ top: 10, bottom: 30, left: 40, right: 10 }}
          domainPadding={{ y: [padding, padding] }}
        >
          <VictoryAxis
            tickFormat={(t) => {
              // Format date or return the tick value
              if (t instanceof Date) {
                return t.getDate() + '/' + (t.getMonth() + 1);
              }
              return t;
            }}
            style={{
              tickLabels: { fontSize: 10, padding: 5 }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 10, padding: 5 }
            }}
          />
          <VictoryLine
            data={data}
            style={{
              data: { 
                stroke: color || theme.primary,
                strokeWidth: 2,
              }
            }}
            animate={{ duration: 500 }}
          />
          <VictoryScatter
            data={data}
            size={4}
            style={{
              data: { 
                fill: theme.cardBackground,
                stroke: color || theme.primary,
                strokeWidth: 2,
              }
            }}
            animate={{ duration: 500 }}
          />
        </VictoryChart>
      </View>
      
      <View style={styles.axisLabels}>
        <Text style={[styles.axisLabel, { color: theme.textSecondary }]}>
          {xAxisLabel}
        </Text>
        <Text style={[styles.axisLabel, { color: theme.textSecondary }]}>
          {yAxisLabel}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  chartContainer: {
    alignItems: 'center',
  },
  axisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  axisLabel: {
    fontSize: FONT_SIZES.xs,
  },
});

export default ProgressChart;
