const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      type="submit"
      className={`w-full text-white py-2 rounded my-1 bg-[#58736D] hover:bg-[#4e665f] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
