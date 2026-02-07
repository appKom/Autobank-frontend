interface Props {
  title: string;
  color: "blue" | "white" | "orange" | "green" | "darkGreen";
  size?: "small";
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
}

const Button = (props: Props) => {
  let sizeClasses = "";

  const colorClassesMap = {
    green: "bg-[#b0deca] text-black",
    blue: "bg-blue-300",
    orange: "bg-orange-300",
    white: "bg-white text-black",
    darkGreen: "bg-[#1a4b36] text-white",
  };

  // Use the `props.color` to dynamically get the class, with a fallback if needed.
  let colorClasses = colorClassesMap[props.color] || "";

  // Determine button size
  if (props.size === "small") {
    sizeClasses = "w-[100px] h-[40px] px-5 py-2.5 text-sm";
  } else {
    sizeClasses = "w-[140px] h-[50px] px-6 py-3";
  }

  // Combine class names, ensuring `props.className` is applied last for higher precedence
  const className = `flex items-center justify-center p-2 h-[40px] justify-self-end relative z-20 font-medium text-center transition-all shadow-sm focus:ring focus:ring-primary-200 inline-flex items-center gap-1.5 ${colorClasses} ${sizeClasses} rounded-[15px] ${
    props.className || ""
  }`;

  if (props.href) {
    return (
      <a href={props.href} className={className}>
        {props.title}
        {props.icon}
      </a>
    );
  }

  return (
    <button type="button" onClick={props.onClick} className={className}>
      {props.title}
      {props.icon}
    </button>
  );
};

export default Button;
