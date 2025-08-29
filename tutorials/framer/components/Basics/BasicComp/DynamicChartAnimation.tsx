"use client";
import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
  type: "bar" | "line";
  color?: string;
}

const DynamicChart: React.FC = () => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [dataSet, setDataSet] = useState<DataPoint[]>([]);

  // Sample data sets
  const dataSets = {
    monthly: [
      { label: "Jan", value: 65 },
      { label: "Feb", value: 78 },
      { label: "Mar", value: 90 },
      { label: "Apr", value: 81 },
      { label: "May", value: 56 },
      { label: "Jun", value: 55 },
      { label: "Jul", value: 40 },
      { label: "Aug", value: 45 },
      { label: "Sep", value: 60 },
      { label: "Oct", value: 75 },
      { label: "Nov", value: 85 },
      { label: "Dec", value: 95 },
    ],
    quarterly: [
      { label: "Q1", value: 85 },
      { label: "Q2", value: 65 },
      { label: "Q3", value: 45 },
      { label: "Q4", value: 75 },
    ],
    weekly: [
      { label: "Mon", value: 30 },
      { label: "Tue", value: 45 },
      { label: "Wed", value: 60 },
      { label: "Thu", value: 75 },
      { label: "Fri", value: 90 },
      { label: "Sat", value: 65 },
      { label: "Sun", value: 40 },
    ],
  };

  // Initialize with monthly data
  useEffect(() => {
    setDataSet(dataSets.monthly);
  }, []);

  return (
    <div style={styles.container}>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dynamic Chart Animations
      </motion.h1>

      <motion.div
        style={styles.controls}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div style={styles.buttonGroup}>
          <motion.button
            style={{
              ...styles.button,
              ...(chartType === "bar" ? styles.activeButton : {}),
            }}
            onClick={() => setChartType("bar")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bar Chart
          </motion.button>
          <motion.button
            style={{
              ...styles.button,
              ...(chartType === "line" ? styles.activeButton : {}),
            }}
            onClick={() => setChartType("line")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Line Chart
          </motion.button>
        </div>

        <div style={styles.buttonGroup}>
          <motion.button
            style={styles.dataButton}
            onClick={() => setDataSet(dataSets.monthly)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Monthly
          </motion.button>
          <motion.button
            style={styles.dataButton}
            onClick={() => setDataSet(dataSets.quarterly)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Quarterly
          </motion.button>
          <motion.button
            style={styles.dataButton}
            onClick={() => setDataSet(dataSets.weekly)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Weekly
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        style={styles.chartContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        key={`${chartType}-${dataSet.length}`}
      >
        {chartType === "bar" ? (
          <BarChart data={dataSet} type="bar" color="#3498db" />
        ) : (
          <LineChart data={dataSet} type="line" color="#e74c3c" />
        )}
      </motion.div>
    </div>
  );
};

const BarChart: React.FC<ChartProps> = ({ data, color = "#3498db" }) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const chartHeight = 300;

  return (
    <div style={styles.chart}>
      <div style={styles.chartYAxis}>
        {[0, 25, 50, 75, 100].map((value) => (
          <div key={value} style={styles.yAxisLabel}>
            {value}
          </div>
        ))}
      </div>

      <div style={styles.barContainer}>
        {data.map((item, index) => (
          <Bar
            key={item.label}
            item={item}
            index={index}
            maxValue={maxValue}
            chartHeight={chartHeight}
            color={color}
          />
        ))}
      </div>

      <div style={styles.xAxis}>
        {data.map((item) => (
          <div key={item.label} style={styles.xAxisLabel}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const Bar: React.FC<{
  item: DataPoint;
  index: number;
  maxValue: number;
  chartHeight: number;
  color: string;
}> = ({ item, index, maxValue, chartHeight, color }) => {
  const height = useSpring(0, {
    stiffness: 100,
    damping: 15,
    restSpeed: 0.1,
  });

  const heightTransform = useTransform(height, (value) => {
    return (value / maxValue) * chartHeight;
  });

  useEffect(() => {
    height.set(item.value);
  }, [item.value, height]);

  return (
    <div style={styles.barWrapper}>
      <motion.div
        style={{
          ...styles.bar,
          height: heightTransform,
          backgroundColor: color,
        }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: index * 0.05,
        }}
      />
      <motion.div
        style={styles.barValue}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 + 0.3 }}
      >
        {item.value}
      </motion.div>
    </div>
  );
};

const LineChart: React.FC<ChartProps> = ({ data, color = "#e74c3c" }) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const chartHeight = 300;
  const chartWidth = 600;
  const pointWidth = chartWidth / (data.length - 1);

  // Calculate path for line
  const getPath = () => {
    let path = `M 0 ${chartHeight - (data[0].value / maxValue) * chartHeight} `;

    data.forEach((item, index) => {
      if (index === 0) return;
      path += `L ${index * pointWidth} ${
        chartHeight - (item.value / maxValue) * chartHeight
      } `;
    });

    return path;
  };

  // Calculate area under line
  const getArea = () => {
    let area = `M 0 ${chartHeight - (data[0].value / maxValue) * chartHeight} `;

    data.forEach((item, index) => {
      if (index === 0) return;
      area += `L ${index * pointWidth} ${
        chartHeight - (item.value / maxValue) * chartHeight
      } `;
    });

    area += `L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

    return area;
  };

  return (
    <div style={styles.chart}>
      <div style={styles.chartYAxis}>
        {[0, 25, 50, 75, 100].map((value) => (
          <div key={value} style={styles.yAxisLabel}>
            {value}
          </div>
        ))}
      </div>

      <div style={styles.lineContainer}>
        <svg width={chartWidth} height={chartHeight} style={styles.svg}>
          {/* Area fill */}
          <motion.path
            d={getArea()}
            fill={`${color}20`}
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={getPath()}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />

          {/* Points */}
          {data.map((item, index) => (
            <motion.circle
              key={index}
              cx={index * pointWidth}
              cy={chartHeight - (item.value / maxValue) * chartHeight}
              r="5"
              fill={color}
              stroke="#fff"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: index * 0.1 + 0.3,
              }}
            />
          ))}
        </svg>

        {/* Values */}
        {data.map((item, index) => (
          <motion.div
            key={index}
            style={{
              ...styles.lineValue,
              left: index * pointWidth - 15,
              top: chartHeight - (item.value / maxValue) * chartHeight - 30,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            {item.value}
          </motion.div>
        ))}
      </div>

      <div style={styles.xAxis}>
        {data.map((item) => (
          <div key={item.label} style={styles.xAxisLabel}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "1rem",
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2c3e50",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    border: "2px solid #3498db",
    borderRadius: "8px",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  activeButton: {
    backgroundColor: "#3498db",
    color: "white",
  },
  dataButton: {
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#2c3e50",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    border: "1px solid #95a5a6",
    borderRadius: "6px",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "800px",
  },
  chart: {
    display: "flex",
    flexDirection: "column",
    height: "400px",
  },
  chartYAxis: {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    height: "300px",
    marginRight: "1rem",
    color: "#7f8c8d",
    fontSize: "0.8rem",
  },
  yAxisLabel: {
    textAlign: "right",
    paddingRight: "0.5rem",
  },
  barContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: "300px",
    flex: 1,
    padding: "0 1rem",
  },
  barWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    position: "relative",
    width: "40px",
  },
  bar: {
    width: "30px",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.3s ease",
  },
  barValue: {
    position: "absolute",
    top: "-25px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#2c3e50",
  },
  lineContainer: {
    position: "relative",
    height: "300px",
    flex: 1,
    margin: "0 1rem",
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  lineValue: {
    position: "absolute",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#2c3e50",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "0.2rem 0.4rem",
    borderRadius: "4px",
    backdropFilter: "blur(5px)",
  },
  xAxis: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "0.5rem",
    borderTop: "1px solid #ecf0f1",
    paddingTop: "0.5rem",
  },
  xAxisLabel: {
    fontSize: "0.8rem",
    color: "#7f8c8d",
    textAlign: "center",
    width: "40px",
  },
};

export default DynamicChart;
