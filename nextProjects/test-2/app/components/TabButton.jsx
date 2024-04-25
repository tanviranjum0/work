const TabButton = ({ active, selectTab, children }) => {
  const buttonClasses = active
    ? "border-b border-purple-500"
    : "text-[#ADB7BE]";
  return (
    <>
      <button
        onClick={selectTab}
        className={`mr-4 py-2 hover:text-white cursor-pointer ${buttonClasses} `}
      >
        {children}
      </button>
    </>
  );
};

export default TabButton;
