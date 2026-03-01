import React from "react";

interface SpinnerProps {
  size?: number; // Size of the spinner
  color?: "blue" | "red" | "green" | "yellow" | "purple"; // Define base colors
}

const Spinner: React.FC<SpinnerProps> = ({ size = 8, color = "blue" }) => {
  const colorMap: { [key: string]: string } = {
    blue: "border-blue-500",
    red: "border-red-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
  };

  const borderColor = colorMap[color] || colorMap["blue"]; // Fallback to blue

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${borderColor}`}
        style={{
          width: `${size * 8}px`,
          height: `${size * 8}px`,
        }}
      ></div>
    </div>
  );
};

export default Spinner;
